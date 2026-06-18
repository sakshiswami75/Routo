import { Router } from 'express';
import { ParcelController } from '../controllers/parcel.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createParcelSchema } from '../validators/parcel.validator';

const router = Router();
const parcelController = new ParcelController();

// Apply auth middleware to all parcel routes
router.use(authMiddleware);

router.post('/', validateRequest(createParcelSchema), parcelController.create);
router.get('/', parcelController.getAll);
router.get('/:id', parcelController.getById);

export default router;
