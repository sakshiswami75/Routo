import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class DeliveryController {
  private deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  accept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const delivery = await this.deliveryService.acceptParcel(req.user.id, req.body);
      sendResponse(res, 201, 'Parcel accepted successfully', delivery);
    } catch (error) {
      next(error);
    }
  };

  getMyDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const deliveries = await this.deliveryService.getMyDeliveries(req.user.id);
      sendResponse(res, 200, 'Deliveries retrieved successfully', deliveries);
    } catch (error) {
      next(error);
    }
  };

  markPickedUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const id = req.params.id as string;
      const delivery = await this.deliveryService.markPickedUp(id, req.user.id);
      sendResponse(res, 200, 'Delivery marked as picked up successfully', delivery);
    } catch (error) {
      next(error);
    }
  };

  markInTransit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const id = req.params.id as string;
      const delivery = await this.deliveryService.markInTransit(id, req.user.id);
      sendResponse(res, 200, 'Delivery marked as in transit successfully', delivery);
    } catch (error) {
      next(error);
    }
  };

  markDelivered = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const id = req.params.id as string;
      const delivery = await this.deliveryService.markDelivered(id, req.user.id);
      sendResponse(res, 200, 'Delivery marked as delivered successfully', delivery);
    } catch (error) {
      next(error);
    }
  };
}
