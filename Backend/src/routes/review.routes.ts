import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { carrierReviewParamSchema, createReviewSchema } from '../validators/review.validator';

const router = Router();
const reviewController = new ReviewController();

router.use(authMiddleware);

router.post('/', validateRequest(createReviewSchema), reviewController.create);
router.get('/carrier/:carrierId', validateRequest(carrierReviewParamSchema), reviewController.getCarrierReviews);
router.get('/me', reviewController.getMyReviews);

export default router;
