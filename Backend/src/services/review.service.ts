import { DeliveryStatus } from '@prisma/client';
import { ReviewRepository } from '../repositories/review.repository';
import { CreateReviewInput } from '../validators/review.validator';
import { AppError } from '../utils/AppError';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(senderId: string, data: CreateReviewInput) {
    if (!senderId) {
      throw new AppError('Unauthorized: Sender ID is required', 401);
    }

    const delivery = await this.reviewRepository.findDeliveryById(data.deliveryId);
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    if (delivery.status !== DeliveryStatus.DELIVERED) {
      throw new AppError('Delivery must be completed before review', 400);
    }

    if (delivery.parcel.senderId !== senderId) {
      throw new AppError('You are not authorized to review this delivery', 403);
    }

    const existingReview = await this.reviewRepository.findByDeliveryId(data.deliveryId);
    if (existingReview) {
      throw new AppError('You have already reviewed this delivery', 409);
    }

    return await this.reviewRepository.create(senderId, delivery.carrierId, data);
  }

  async getCarrierReviews(carrierId: string) {
    const reviews = await this.reviewRepository.findByCarrierId(carrierId);
    const stats = await this.reviewRepository.getCarrierRatingStats(carrierId);

    return {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
      reviews,
    };
  }

  async getMyReviews(carrierId: string) {
    if (!carrierId) {
      throw new AppError('Unauthorized: Carrier ID is required', 401);
    }

    return await this.getCarrierReviews(carrierId);
  }
}
