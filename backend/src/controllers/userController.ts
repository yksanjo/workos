import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';

export class UserController {
  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const result = await query(
        'SELECT id, email, name, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateMe(req: AuthRequest, res: Response) {
    try {
      const { name } = req.body;
      const userId = req.user!.id;

      const result = await query(
        'UPDATE users SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING id, email, name',
        [name, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

