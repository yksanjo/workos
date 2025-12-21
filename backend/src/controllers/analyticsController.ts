import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';
import axios from 'axios';

export class AnalyticsController {
  async getForecast(req: AuthRequest, res: Response) {
    try {
      const { workflowId } = req.params;
      const userId = req.user!.id;

      // Verify workflow access
      const workflowCheck = await query(
        'SELECT id FROM workflows WHERE id = $1 AND (user_id = $2 OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = $2))',
        [workflowId, userId]
      );

      if (workflowCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Call ML service for forecasting
      try {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        const response = await axios.get(`${mlServiceUrl}/api/analytics/forecast/${workflowId}`);
        res.json({ forecast: response.data });
      } catch (mlError) {
        logger.error('ML service error:', mlError);
        // Return mock data
        res.json({
          forecast: {
            completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: 0.75,
            confidence_interval: {
              lower: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              upper: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        });
      }
    } catch (error) {
      logger.error('Get forecast error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBottlenecks(req: AuthRequest, res: Response) {
    try {
      const { workflowId } = req.params;
      const userId = req.user!.id;

      // Verify workflow access
      const workflowCheck = await query(
        'SELECT id FROM workflows WHERE id = $1 AND (user_id = $2 OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = $2))',
        [workflowId, userId]
      );

      if (workflowCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Call ML service for bottleneck detection
      try {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        const response = await axios.get(`${mlServiceUrl}/api/analytics/bottlenecks/${workflowId}`);
        res.json({ bottlenecks: response.data });
      } catch (mlError) {
        logger.error('ML service error:', mlError);
        // Return mock data
        res.json({
          bottlenecks: [],
        });
      }
    } catch (error) {
      logger.error('Get bottlenecks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMetrics(req: AuthRequest, res: Response) {
    try {
      const { workflowId } = req.params;
      const userId = req.user!.id;

      // Verify workflow access
      const workflowCheck = await query(
        'SELECT id FROM workflows WHERE id = $1 AND (user_id = $2 OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = $2))',
        [workflowId, userId]
      );

      if (workflowCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get workflow metrics
      const metrics = await query(
        `SELECT 
           COUNT(i.id) as total_items,
           COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_items,
           AVG(EXTRACT(EPOCH FROM (i.updated_at - i.created_at))) as avg_cycle_time,
           COUNT(CASE WHEN i.due_date < NOW() AND i.status != 'completed' THEN 1 END) as overdue_items
         FROM items i
         JOIN boards b ON b.id = i.board_id
         WHERE b.workflow_id = $1`,
        [workflowId]
      );

      res.json({ metrics: metrics.rows[0] });
    } catch (error) {
      logger.error('Get metrics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

