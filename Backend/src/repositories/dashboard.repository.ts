import { ParcelStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export type RecentParcel = Prisma.ParcelGetPayload<{
  include: {
    delivery: true;
  };
}>;

export class DashboardRepository {
  async getSenderParcelSummary(senderId: string) {
    const [
      totalParcelsCreated,
      pendingParcels,
      acceptedParcels,
      deliveredParcels,
      recentParcels,
    ] = await Promise.all([
      prisma.parcel.count({
        where: { senderId },
      }),
      prisma.parcel.count({
        where: {
          senderId,
          status: ParcelStatus.PENDING,
        },
      }),
      prisma.parcel.count({
        where: {
          senderId,
          status: ParcelStatus.ACCEPTED,
        },
      }),
      prisma.parcel.count({
        where: {
          senderId,
          status: ParcelStatus.DELIVERED,
        },
      }),
      prisma.parcel.findMany({
        where: { senderId },
        include: {
          delivery: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ]);

    return {
      totalParcelsCreated,
      pendingParcels,
      acceptedParcels,
      deliveredParcels,
      recentParcels,
    };
  }
}
