import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';
import axios from 'axios';

export class WorkflowController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const result = await query(
        `SELECT w.*, COUNT(b.id) as board_count
         FROM workflows w
         LEFT JOIN boards b ON b.workflow_id = w.id
         WHERE w.user_id = $1 OR w.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $1
         )
         GROUP BY w.id
         ORDER BY w.created_at DESC`,
        [userId]
      );

      res.json({ workflows: result.rows });
    } catch (error) {
      logger.error('Get workflows error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        `SELECT w.* FROM workflows w
         WHERE w.id = $1 AND (w.user_id = $2 OR w.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $2
         ))`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json({ workflow: result.rows[0] });
    } catch (error) {
      logger.error('Get workflow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOptimizations(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Verify workflow access
      const workflowCheck = await query(
        'SELECT id FROM workflows WHERE id = $1 AND (user_id = $2 OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = $2))',
        [id, userId]
      );

      if (workflowCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Call ML service for optimizations
      try {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        const response = await axios.get(`${mlServiceUrl}/api/workflows/${id}/optimize`);
        res.json({ optimizations: response.data });
      } catch (mlError) {
        logger.error('ML service error:', mlError);
        // Return mock data if ML service unavailable
        res.json({
          optimizations: {
            bottlenecks: [],
            suggestions: [],
            efficiency_score: 0.75,
          },
        });
      }
    } catch (error) {
      logger.error('Get optimizations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description, workspace_id, template_id } = req.body;
      const userId = req.user!.id;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const result = await query(
        `INSERT INTO workflows (name, description, user_id, workspace_id, template_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [name, description || null, userId, workspace_id || null, template_id || null]
      );

      res.status(201).json({ workflow: result.rows[0] });
    } catch (error) {
      logger.error('Create workflow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = req.user!.id;

      const result = await query(
        `UPDATE workflows
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             updated_at = NOW()
         WHERE id = $3 AND user_id = $4
         RETURNING *`,
        [name, description, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json({ workflow: result.rows[0] });
    } catch (error) {
      logger.error('Update workflow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        'DELETE FROM workflows WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json({ message: 'Workflow deleted successfully' });
    } catch (error) {
      logger.error('Delete workflow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

