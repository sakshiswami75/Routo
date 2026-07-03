import { Delivery, DeliveryStatus, Parcel, ParcelStatus, Prisma, TransactionType, TransactionStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export type DeliveryWithRelations = Delivery & {
  parcel: Parcel;
  carrier: {
    id: string;
    name: string;
    email: string;
  };
};

export class DeliveryRepository {
  async findParcelById(parcelId: string): Promise<Parcel | null> {
    return await prisma.parcel.findUnique({
      where: { id: parcelId },
    });
  }

  async acceptParcel(parcelId: string, carrierId: string): Promise<DeliveryWithRelations | null> {
    return await prisma.$transaction(async (tx): Promise<DeliveryWithRelations | null> => {
      const updatedParcel = await tx.parcel.updateMany({
        where: {
          id: parcelId,
          status: ParcelStatus.PENDING,
        },
        data: { status: ParcelStatus.ACCEPTED },
      });

      if (updatedParcel.count === 0) {
        return null;
      }

      return (await tx.delivery.create({
        data: {
          parcelId,
          carrierId,
          status: DeliveryStatus.ACCEPTED,
        },
        include: {
          parcel: true,
          carrier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })) as DeliveryWithRelations;
    });
  }

  async findByCarrierId(carrierId: string): Promise<DeliveryWithRelations[]> {
    const deliveries = await prisma.delivery.findMany({
      where: { carrierId },
      include: {
        parcel: true,
        carrier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        acceptedAt: 'desc',
      },
    });
    
    return deliveries as DeliveryWithRelations[];
  }

  async findById(id: string): Promise<Delivery | null> {
    return await prisma.delivery.findUnique({
      where: { id },
    });
  }

  async markPickedUp(id: string): Promise<DeliveryWithRelations> {
    return await prisma.$transaction(async (tx): Promise<DeliveryWithRelations> => {
      const delivery = await tx.delivery.update({
        where: { id },
        data: {
          status: DeliveryStatus.PICKED_UP,
        },
      });

      await tx.parcel.update({
        where: { id: delivery.parcelId },
        data: { status: ParcelStatus.PICKED_UP },
      });

      return (await tx.delivery.findUniqueOrThrow({
        where: { id },
        include: {
          parcel: true,
          carrier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })) as DeliveryWithRelations;
    });
  }

  async markInTransit(id: string): Promise<DeliveryWithRelations> {
    return await prisma.$transaction(async (tx): Promise<DeliveryWithRelations> => {
      const delivery = await tx.delivery.update({
        where: { id },
        data: {
          status: DeliveryStatus.IN_TRANSIT,
        },
      });

      await tx.parcel.update({
        where: { id: delivery.parcelId },
        data: { status: ParcelStatus.IN_TRANSIT },
      });

      return (await tx.delivery.findUniqueOrThrow({
        where: { id },
        include: {
          parcel: true,
          carrier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })) as DeliveryWithRelations;
    });
  }

  async verifyOTPAndDeliver(id: string, otpId: string): Promise<DeliveryWithRelations> {
    return await prisma.$transaction(async (tx): Promise<DeliveryWithRelations> => {
      const existingDelivery = await tx.delivery.findUnique({
        where: { id },
        include: { parcel: true },
      });

      if (!existingDelivery) {
        throw new Error('Delivery not found');
      }

      if (existingDelivery.status === DeliveryStatus.DELIVERED) {
        throw new Error('Delivery is already marked as DELIVERED');
      }

      // Atomically mark OTP as verified to prevent race conditions
      const otp = await tx.deliveryOTP.updateMany({
        where: { 
          id: otpId,
          verified: false
        },
        data: { verified: true }
      });

      if (otp.count === 0) {
        throw new Error('OTP already verified or not found');
      }

      const delivery = await tx.delivery.update({
        where: { id },
        data: {
          status: DeliveryStatus.DELIVERED,
          deliveredAt: new Date(),
        },
      });

      const parcel = await tx.parcel.update({
        where: { id: delivery.parcelId },
        data: { status: ParcelStatus.DELIVERED },
      });

      const rewardAmount = parcel.rewardAmount;

      await tx.user.update({
        where: { id: existingDelivery.carrierId },
        data: {
          walletBalance: { increment: rewardAmount },
          totalEarnings: { increment: rewardAmount },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: existingDelivery.carrierId,
          deliveryId: delivery.id,
          amount: rewardAmount,
          transactionType: TransactionType.CREDIT,
          status: TransactionStatus.SUCCESS,
          description: `Reward for delivering parcel ${parcel.title}`,
        },
      });

      return (await tx.delivery.findUniqueOrThrow({
        where: { id },
        include: {
          parcel: true,
          carrier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })) as DeliveryWithRelations;
    });
  }
}
