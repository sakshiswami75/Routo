import { Router } from 'express';
import { RouteController } from '../controllers/route.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createRouteSchema, routeIdParamSchema } from '../validators/route.validator';

const router = Router();
const routeController = new RouteController();

router.use(authMiddleware);

router.post('/', validateRequest(createRouteSchema), routeController.createRoute);
router.get('/my', routeController.getMyRoutes);
router.get('/:id', validateRequest(routeIdParamSchema), routeController.getRouteById);
router.delete('/:id', validateRequest(routeIdParamSchema), routeController.deleteRoute);

export default router;
