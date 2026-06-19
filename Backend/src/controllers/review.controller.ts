import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const review = await this.reviewService.createReview(req.user.id, req.body);
      sendResponse(res, 201, 'Review created successfully', review);
    } catch (error) {
      next(error);
    }
  };

  getCarrierReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const carrierId = req.params.carrierId as string;
      const reviews = await this.reviewService.getCarrierReviews(carrierId);
      sendResponse(res, 200, 'Carrier reviews retrieved successfully', reviews);
    } catch (error) {
      next(error);
    }
  };

  getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const reviews = await this.reviewService.getMyReviews(req.user.id);
      sendResponse(res, 200, 'My reviews retrieved successfully', reviews);
    } catch (error) {
      next(error);
    }
  };
}
