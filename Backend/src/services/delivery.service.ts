import { DeliveryStatus, ParcelStatus } from '@prisma/client';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { AcceptDeliveryInput } from '../validators/delivery.validator';
import { AppError } from '../utils/AppError';

export class DeliveryService {
  private deliveryRepository: DeliveryRepository;

  constructor() {
    this.deliveryRepository = new DeliveryRepository();
  }

  async acceptParcel(carrierId: string, data: AcceptDeliveryInput) {
    if (!carrierId) {
      throw new AppError('Unauthorized: Carrier ID is required', 401);
    }

    const parcel = await this.deliveryRepository.findParcelById(data.parcelId);
    if (!parcel) {
      throw new AppError('Parcel not found', 404);
    }

    if (parcel.senderId === carrierId) {
      throw new AppError('You cannot accept your own parcel for delivery', 400);
    }

    if (parcel.status !== ParcelStatus.PENDING) {
      throw new AppError('Parcel is not available for acceptance', 400);
    }

    const delivery = await this.deliveryRepository.acceptParcel(data.parcelId, carrierId);
    if (!delivery) {
      throw new AppError('Parcel is not available for acceptance', 400);
    }

    return delivery;
  }

  async getMyDeliveries(carrierId: string) {
    if (!carrierId) {
      throw new AppError('Unauthorized: Carrier ID is required', 401);
    }

    return await this.deliveryRepository.findByCarrierId(carrierId);
  }

  async markInTransit(deliveryId: string, carrierId: string) {
    if (!carrierId) {
      throw new AppError('Unauthorized: Carrier ID is required', 401);
    }

    const delivery = await this.deliveryRepository.findById(deliveryId);
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    if (delivery.carrierId !== carrierId) {
      throw new AppError('You are not authorized to update this delivery', 403);
    }

    if (delivery.status !== DeliveryStatus.ACCEPTED) {
      throw new AppError('Delivery must be accepted before marking in transit', 400);
    }

    return await this.deliveryRepository.markInTransit(deliveryId);
  }

  async markDelivered(deliveryId: string, carrierId: string) {
    if (!carrierId) {
      throw new AppError('Unauthorized: Carrier ID is required', 401);
    }

    const delivery = await this.deliveryRepository.findById(deliveryId);
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    if (delivery.carrierId !== carrierId) {
      throw new AppError('You are not authorized to update this delivery', 403);
    }

    if (delivery.status !== DeliveryStatus.IN_TRANSIT) {
      throw new AppError('Delivery must be in transit before marking delivered', 400);
    }

    return await this.deliveryRepository.markDelivered(deliveryId);
  }
}
