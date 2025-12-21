import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get('/me', userController.getMe.bind(userController));
router.put('/me', userController.updateMe.bind(userController));

export default router;

