import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db';
import { logger } from '../utils/logger';

export class ItemController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { board_id } = req.query;
      const userId = req.user!.id;

      let sql = `
        SELECT i.*, b.name as board_name
        FROM items i
        JOIN boards b ON b.id = i.board_id
        WHERE (b.user_id = $1 OR b.workspace_id IN (
          SELECT workspace_id FROM workspace_members WHERE user_id = $1
        ))
      `;
      const params: any[] = [userId];

      if (board_id) {
        sql += ' AND i.board_id = $2';
        params.push(board_id);
      }

      sql += ' ORDER BY i.created_at DESC';

      const result = await query(sql, params);
      res.json({ items: result.rows });
    } catch (error) {
      logger.error('Get items error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        `SELECT i.*, b.name as board_name
         FROM items i
         JOIN boards b ON b.id = i.board_id
         WHERE i.id = $1 AND (b.user_id = $2 OR b.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $2
         ))`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      logger.error('Get item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { board_id, title, description, status, assignee_id, due_date } = req.body;
      const userId = req.user!.id;

      if (!board_id || !title) {
        return res.status(400).json({ error: 'Board ID and title are required' });
      }

      // Verify board access
      const boardCheck = await query(
        'SELECT id FROM boards WHERE id = $1 AND (user_id = $2 OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = $2))',
        [board_id, userId]
      );

      if (boardCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const result = await query(
        `INSERT INTO items (board_id, title, description, status, assignee_id, creator_id, due_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [board_id, title, description || null, status || 'todo', assignee_id || null, userId, due_date || null]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      logger.error('Create item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status, assignee_id, due_date } = req.body;
      const userId = req.user!.id;

      const result = await query(
        `UPDATE items
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             status = COALESCE($3, status),
             assignee_id = COALESCE($4, assignee_id),
             due_date = COALESCE($5, due_date),
             updated_at = NOW()
         WHERE id = $6 AND board_id IN (
           SELECT id FROM boards WHERE user_id = $7 OR workspace_id IN (
             SELECT workspace_id FROM workspace_members WHERE user_id = $7
           )
         )
         RETURNING *`,
        [title, description, status, assignee_id, due_date, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      logger.error('Update item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await query(
        `DELETE FROM items
         WHERE id = $1 AND board_id IN (
           SELECT id FROM boards WHERE user_id = $2 OR workspace_id IN (
             SELECT workspace_id FROM workspace_members WHERE user_id = $2
           )
         )
         RETURNING id`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      logger.error('Delete item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

