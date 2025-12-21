import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';

export class BoardController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const result = await query(
        `SELECT b.*, COUNT(i.id) as item_count
         FROM boards b
         LEFT JOIN items i ON i.board_id = b.id
         WHERE b.user_id = $1 OR b.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $1
         )
         GROUP BY b.id
         ORDER BY b.created_at DESC`,
        [userId]
      );

      res.json({ boards: result.rows });
    } catch (error) {
      logger.error('Get boards error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        `SELECT b.* FROM boards b
         WHERE b.id = $1 AND (b.user_id = $2 OR b.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $2
         ))`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json({ board: result.rows[0] });
    } catch (error) {
      logger.error('Get board error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description, workspace_id, view_type } = req.body;
      const userId = req.user!.id;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const result = await query(
        `INSERT INTO boards (name, description, user_id, workspace_id, view_type, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [name, description || null, userId, workspace_id || null, view_type || 'board']
      );

      res.status(201).json({ board: result.rows[0] });
    } catch (error) {
      logger.error('Create board error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, view_type } = req.body;
      const userId = req.user!.id;

      const result = await query(
        `UPDATE boards
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             view_type = COALESCE($3, view_type),
             updated_at = NOW()
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [name, description, view_type, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json({ board: result.rows[0] });
    } catch (error) {
      logger.error('Update board error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        'DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json({ message: 'Board deleted successfully' });
    } catch (error) {
      logger.error('Delete board error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

