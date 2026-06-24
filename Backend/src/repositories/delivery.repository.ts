import { Delivery, DeliveryStatus, Parcel, ParcelStatus, Prisma } from '@prisma/client';
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

  async markDelivered(id: string): Promise<DeliveryWithRelations> {
    return await prisma.$transaction(async (tx): Promise<DeliveryWithRelations> => {
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
