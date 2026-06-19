import { RouteRepository } from '../repositories/route.repository';
import { CreateRouteInput } from '../validators/route.validator';
import { AppError } from '../utils/AppError';

export class RouteService {
  private routeRepository: RouteRepository;

  constructor() {
    this.routeRepository = new RouteRepository();
  }

  async createRoute(travelerId: string, data: CreateRouteInput) {
    if (!travelerId) {
      throw new AppError('Unauthorized: Traveler ID is required', 401);
    }

    return await this.routeRepository.createRoute({
      ...data,
      travelDate: new Date(data.travelDate),
      travelerId,
    });
  }

  async getMyRoutes(travelerId: string) {
    if (!travelerId) {
      throw new AppError('Unauthorized: Traveler ID is required', 401);
    }

    return await this.routeRepository.findByTravelerId(travelerId);
  }

  async getRouteById(routeId: string) {
    const route = await this.routeRepository.findById(routeId);
    if (!route) {
      throw new AppError('Route not found', 404);
    }
    return route;
  }

  async deleteRoute(routeId: string, travelerId: string) {
    if (!travelerId) {
      throw new AppError('Unauthorized: Traveler ID is required', 401);
    }

    const route = await this.routeRepository.findById(routeId);
    if (!route) {
      throw new AppError('Route not found', 404);
    }

    if (route.travelerId !== travelerId) {
      throw new AppError('You are not authorized to delete this route', 403);
    }

    return await this.routeRepository.deleteRoute(routeId);
  }
}
