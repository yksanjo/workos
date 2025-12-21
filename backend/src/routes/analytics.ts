import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticate);

router.get('/forecast/:workflowId', analyticsController.getForecast.bind(analyticsController));
router.get('/bottlenecks/:workflowId', analyticsController.getBottlenecks.bind(analyticsController));
router.get('/metrics/:workflowId', analyticsController.getMetrics.bind(analyticsController));

export default router;

