import { Request, Response, NextFunction } from 'express';
import { RouteService } from '../services/route.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class RouteController {
  private routeService: RouteService;

  constructor() {
    this.routeService = new RouteService();
  }

  createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const route = await this.routeService.createRoute(req.user.id, req.body);
      sendResponse(res, 201, 'Route created successfully', route);
    } catch (error) {
      next(error);
    }
  };

  getMyRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const routes = await this.routeService.getMyRoutes(req.user.id);
      sendResponse(res, 200, 'Routes retrieved successfully', routes);
    } catch (error) {
      next(error);
    }
  };

  getRouteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const route = await this.routeService.getRouteById(id);
      sendResponse(res, 200, 'Route retrieved successfully', route);
    } catch (error) {
      next(error);
    }
  };

  deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const id = req.params.id as string;
      await this.routeService.deleteRoute(id, req.user.id);
      sendResponse(res, 200, 'Route deleted successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
