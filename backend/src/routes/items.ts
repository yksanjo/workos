import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { authenticate } from '../middleware/auth';

const router = Router();
const itemController = new ItemController();

router.use(authenticate);

router.get('/', itemController.getAll.bind(itemController));
router.get('/:id', itemController.getById.bind(itemController));
router.post('/', itemController.create.bind(itemController));
router.put('/:id', itemController.update.bind(itemController));
router.delete('/:id', itemController.delete.bind(itemController));

export default router;

