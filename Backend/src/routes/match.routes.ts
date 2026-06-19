import { Router } from 'express';
import { MatchController } from '../controllers/match.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { routeMatchParamSchema } from '../validators/match.validator';

const router = Router();
const matchController = new MatchController();

router.use(authMiddleware);

// GET /api/routes/:routeId/matches
router.get('/routes/:routeId/matches', validateRequest(routeMatchParamSchema), matchController.getRouteMatches);

// GET /api/parcels/matches
router.get('/parcels/matches', matchController.getTravelerMatches);

export default router;
