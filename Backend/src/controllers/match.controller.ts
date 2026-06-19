import { Request, Response, NextFunction } from 'express';
import { MatchService } from '../services/match.service';
import { sendResponse } from '../utils/response.formatter';

export class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  getRouteMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const routeId = req.params.routeId as string;
      const travelerId = req.user!.id;
      
      const matches = await this.matchService.getMatchesByRouteId(routeId, travelerId);
      sendResponse(res, 200, 'Route matches retrieved successfully', matches);
    } catch (error) {
      next(error);
    }
  };

  getTravelerMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const travelerId = req.user!.id;
      
      const matches = await this.matchService.getAllMatchesForTraveler(travelerId);
      sendResponse(res, 200, 'All traveler route matches retrieved successfully', matches);
    } catch (error) {
      next(error);
    }
  };
}
