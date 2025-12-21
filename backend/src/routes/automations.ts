import { Router } from 'express';
import { AutomationController } from '../controllers/automationController';
import { authenticate } from '../middleware/auth';

const router = Router();
const automationController = new AutomationController();

router.use(authenticate);

router.get('/', automationController.getAll.bind(automationController));
router.get('/:id', automationController.getById.bind(automationController));
router.post('/', automationController.create.bind(automationController));
router.put('/:id', automationController.update.bind(automationController));
router.delete('/:id', automationController.delete.bind(automationController));
router.post('/:id/test', automationController.test.bind(automationController));

export default router;

