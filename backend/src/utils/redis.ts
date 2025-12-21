import Redis from 'ioredis';
import { logger } from './logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.ping();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
}

export { redis };

