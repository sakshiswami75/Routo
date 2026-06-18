import { Delivery, DeliveryStatus, Parcel, ParcelStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export type DeliveryWithRelations = Prisma.DeliveryGetPayload<{
  include: {
    parcel: true;
    carrier: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export class DeliveryRepository {
  async findParcelById(parcelId: string): Promise<Parcel | null> {
    return await prisma.parcel.findUnique({
      where: { id: parcelId },
    });
  }

  async acceptParcel(parcelId: string, carrierId: string): Promise<DeliveryWithRelations | null> {
    return await prisma.$transaction(async (tx) => {
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

      return await tx.delivery.create({
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
      });
    });
  }

  async findByCarrierId(carrierId: string): Promise<DeliveryWithRelations[]> {
    return await prisma.delivery.findMany({
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
  }

  async findById(id: string): Promise<Delivery | null> {
    return await prisma.delivery.findUnique({
      where: { id },
    });
  }

  async markDelivered(id: string): Promise<DeliveryWithRelations> {
    return await prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.update({
        where: { id },
        data: {
          status: DeliveryStatus.DELIVERED,
          deliveredAt: new Date(),
        },
      });

      await tx.parcel.update({
        where: { id: delivery.parcelId },
        data: { status: ParcelStatus.DELIVERED },
      });

      return await tx.delivery.findUniqueOrThrow({
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
      });
    });
  }
}
