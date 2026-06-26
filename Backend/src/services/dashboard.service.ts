import { DeliveryStatus } from '@prisma/client';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { RouteRepository } from '../repositories/route.repository';
import { AppError } from '../utils/AppError';

export class DashboardService {
  private dashboardRepository: DashboardRepository;
  private deliveryRepository: DeliveryRepository;
  private profileRepository: ProfileRepository;
  private reviewRepository: ReviewRepository;
  private routeRepository: RouteRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
    this.deliveryRepository = new DeliveryRepository();
    this.profileRepository = new ProfileRepository();
    this.reviewRepository = new ReviewRepository();
    this.routeRepository = new RouteRepository();
  }

  async getDashboard(userId: string) {
    if (!userId) {
      throw new AppError('Unauthorized: User ID is required', 401);
    }

    const user = await this.profileRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const [senderSummary, routes, deliveries, ratingStats] = await Promise.all([
      this.dashboardRepository.getSenderParcelSummary(userId),
      this.routeRepository.findByTravelerId(userId),
      this.deliveryRepository.findByCarrierId(userId),
      this.reviewRepository.getCarrierRatingStats(userId),
    ]);

    return {
      user,
      sender: senderSummary,
      carrier: {
        totalRoutes: routes.length,
        totalAcceptedDeliveries: deliveries.filter((delivery) => delivery.status === DeliveryStatus.ACCEPTED).length,
        deliveriesInTransit: deliveries.filter((delivery) => delivery.status === DeliveryStatus.IN_TRANSIT).length,
        completedDeliveries: deliveries.filter((delivery) => delivery.status === DeliveryStatus.DELIVERED).length,
        averageRating: ratingStats._avg.rating || 0,
        recentDeliveries: deliveries.slice(0, 5),
      },
    };
  }
}
