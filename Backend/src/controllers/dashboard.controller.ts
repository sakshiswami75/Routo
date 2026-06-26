import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const dashboard = await this.dashboardService.getDashboard(req.user.id);
      sendResponse(res, 200, 'Dashboard retrieved successfully', dashboard);
    } catch (error) {
      next(error);
    }
  };
}
