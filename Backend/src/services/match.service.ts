import { MatchRepository } from '../repositories/match.repository';
import { RouteRepository } from '../repositories/route.repository';
import { AppError } from '../utils/AppError';

export class MatchService {
  private matchRepository: MatchRepository;
  private routeRepository: RouteRepository;

  constructor() {
    this.matchRepository = new MatchRepository();
    this.routeRepository = new RouteRepository();
  }

  async getMatchesByRouteId(routeId: string, travelerId: string) {
    const route = await this.routeRepository.findById(routeId);
    if (!route) {
      throw new AppError('Route not found', 404);
    }

    if (route.travelerId !== travelerId) {
      throw new AppError('You are not authorized to view matches for this route', 403);
    }

    return await this.matchRepository.findMatchesForRoute(route as any);
  }

  async getAllMatchesForTraveler(travelerId: string) {
    const routes = await this.routeRepository.findByTravelerId(travelerId);
    return await this.matchRepository.findMatchesForAllRoutes(routes as any, travelerId);
  }
}
