import { Prisma, Review } from '@prisma/client';
import { prisma } from '../config/prisma';
import { CreateReviewInput } from '../validators/review.validator';

export type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    carrier: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    delivery: {
      include: {
        parcel: true;
      };
    };
  };
}>;

export type ReviewableDelivery = Prisma.DeliveryGetPayload<{
  include: {
    parcel: true;
  };
}>;

export class ReviewRepository {
  async findDeliveryById(deliveryId: string): Promise<ReviewableDelivery | null> {
    return await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        parcel: true,
      },
    });
  }

  async findByDeliveryId(deliveryId: string): Promise<Review | null> {
    return await prisma.review.findUnique({
      where: { deliveryId },
    });
  }

  async create(senderId: string, carrierId: string, data: CreateReviewInput): Promise<ReviewWithRelations> {
    return await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        senderId,
        carrierId,
        deliveryId: data.deliveryId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        carrier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        delivery: {
          include: {
            parcel: true,
          },
        },
      },
    });
  }

  async findByCarrierId(carrierId: string): Promise<ReviewWithRelations[]> {
    return await prisma.review.findMany({
      where: { carrierId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        carrier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        delivery: {
          include: {
            parcel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCarrierRatingStats(carrierId: string) {
    return await prisma.review.aggregate({
      where: { carrierId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
  }
}
