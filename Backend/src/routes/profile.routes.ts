import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateProfileSchema } from '../validators/profile.validator';

const router = Router();
const profileController = new ProfileController();

router.use(authMiddleware);

router.get('/me', profileController.getMe);
router.patch('/me', validateRequest(updateProfileSchema), profileController.updateMe);

export default router;
