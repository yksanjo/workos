import { Server } from 'socket.io';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

export function initializeWebSocket(io: Server) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    logger.info(`User ${userId} connected via WebSocket`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join board rooms when subscribing
    socket.on('subscribe:board', (boardId: string) => {
      socket.join(`board:${boardId}`);
      logger.debug(`User ${userId} subscribed to board ${boardId}`);
    });

    socket.on('unsubscribe:board', (boardId: string) => {
      socket.leave(`board:${boardId}`);
      logger.debug(`User ${userId} unsubscribed from board ${boardId}`);
    });

    // Handle item updates
    socket.on('item:update', (data: { boardId: string; itemId: string; updates: any }) => {
      // Broadcast to all subscribers of the board
      socket.to(`board:${data.boardId}`).emit('item:updated', {
        itemId: data.itemId,
        updates: data.updates,
        userId,
      });
    });

    socket.on('disconnect', () => {
      logger.info(`User ${userId} disconnected`);
    });
  });

  logger.info('WebSocket server initialized');
}

