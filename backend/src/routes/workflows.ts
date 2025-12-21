import { Router } from 'express';
import { WorkflowController } from '../controllers/workflowController';
import { authenticate } from '../middleware/auth';

const router = Router();
const workflowController = new WorkflowController();

router.use(authenticate);

router.get('/', workflowController.getAll.bind(workflowController));
router.get('/:id', workflowController.getById.bind(workflowController));
router.get('/:id/optimize', workflowController.getOptimizations.bind(workflowController));
router.post('/', workflowController.create.bind(workflowController));
router.put('/:id', workflowController.update.bind(workflowController));
router.delete('/:id', workflowController.delete.bind(workflowController));

export default router;

