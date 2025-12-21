import { Router } from 'express';
import { BoardController } from '../controllers/boardController';
import { authenticate } from '../middleware/auth';

const router = Router();
const boardController = new BoardController();

router.use(authenticate);

router.get('/', boardController.getAll.bind(boardController));
router.get('/:id', boardController.getById.bind(boardController));
router.post('/', boardController.create.bind(boardController));
router.put('/:id', boardController.update.bind(boardController));
router.delete('/:id', boardController.delete.bind(boardController));

export default router;

