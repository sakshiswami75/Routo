import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { acceptDeliverySchema, deliveryIdParamSchema } from '../validators/delivery.validator';

const router = Router();
const deliveryController = new DeliveryController();

router.use(authMiddleware);

router.post('/accept', validateRequest(acceptDeliverySchema), deliveryController.accept);
router.get('/my', deliveryController.getMyDeliveries);
router.patch('/:id/pickup', validateRequest(deliveryIdParamSchema), deliveryController.markPickedUp);
router.patch('/:id/in-transit', validateRequest(deliveryIdParamSchema), deliveryController.markInTransit);
router.patch('/:id/deliver', validateRequest(deliveryIdParamSchema), deliveryController.markDelivered);

export default router;
