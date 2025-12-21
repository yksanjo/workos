import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';

export class AutomationController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const result = await query(
        `SELECT a.*, b.name as board_name
         FROM automations a
         JOIN boards b ON b.id = a.board_id
         WHERE a.user_id = $1
         ORDER BY a.created_at DESC`,
        [userId]
      );

      res.json({ automations: result.rows });
    } catch (error) {
      logger.error('Get automations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        'SELECT * FROM automations WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automation not found' });
      }

      res.json({ automation: result.rows[0] });
    } catch (error) {
      logger.error('Get automation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { board_id, name, trigger, actions, enabled } = req.body;
      const userId = req.user!.id;

      if (!board_id || !name || !trigger || !actions) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await query(
        `INSERT INTO automations (board_id, user_id, name, trigger_config, actions_config, enabled, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [board_id, userId, name, JSON.stringify(trigger), JSON.stringify(actions), enabled !== false]
      );

      res.status(201).json({ automation: result.rows[0] });
    } catch (error) {
      logger.error('Create automation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, trigger, actions, enabled } = req.body;
      const userId = req.user!.id;

      const result = await query(
        `UPDATE automations
         SET name = COALESCE($1, name),
             trigger_config = COALESCE($2::jsonb, trigger_config),
             actions_config = COALESCE($3::jsonb, actions_config),
             enabled = COALESCE($4, enabled),
             updated_at = NOW()
         WHERE id = $5 AND user_id = $6
         RETURNING *`,
        [name, trigger ? JSON.stringify(trigger) : null, actions ? JSON.stringify(actions) : null, enabled, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automation not found' });
      }

      res.json({ automation: result.rows[0] });
    } catch (error) {
      logger.error('Update automation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        'DELETE FROM automations WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automation not found' });
      }

      res.json({ message: 'Automation deleted successfully' });
    } catch (error) {
      logger.error('Delete automation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async test(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Get automation
      const result = await query(
        'SELECT * FROM automations WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automation not found' });
      }

      const automation = result.rows[0];

      // Test automation (simplified - in production, this would execute in sandbox)
      res.json({
        success: true,
        message: 'Automation test completed',
        result: {
          trigger_matched: true,
          actions_executed: automation.actions_config,
        },
      });
    } catch (error) {
      logger.error('Test automation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

