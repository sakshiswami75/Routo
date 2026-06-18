import { Parcel } from '@prisma/client';
import { prisma } from '../config/prisma';
import { CreateParcelInput } from '../validators/parcel.validator';

export class ParcelRepository {
  async create(senderId: string, data: CreateParcelInput): Promise<Parcel> {
    return await prisma.parcel.create({
      data: {
        title: data.title,
        description: data.description,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        weight: data.weight,
        rewardAmount: data.rewardAmount,
        senderId,
      },
    });
  }

  async findAll(): Promise<Parcel[]> {
    return await prisma.parcel.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Parcel | null> {
    return await prisma.parcel.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
