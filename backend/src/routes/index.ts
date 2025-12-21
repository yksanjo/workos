import { Router } from 'express';
import authRoutes from './auth';
import boardRoutes from './boards';
import itemRoutes from './items';
import workflowRoutes from './workflows';
import automationRoutes from './automations';
import analyticsRoutes from './analytics';
import userRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/boards', boardRoutes);
router.use('/items', itemRoutes);
router.use('/workflows', workflowRoutes);
router.use('/automations', automationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);

export default router;

