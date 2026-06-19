import { Prisma, Route } from '@prisma/client';
import { prisma } from '../config/prisma';

export type RouteWithTraveler = Prisma.RouteGetPayload<{
  include: {
    traveler: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export class RouteRepository {
  async createRoute(data: Prisma.RouteUncheckedCreateInput): Promise<RouteWithTraveler> {
    return await prisma.route.create({
      data,
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByTravelerId(travelerId: string): Promise<RouteWithTraveler[]> {
    return await prisma.route.findMany({
      where: { travelerId },
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        travelDate: 'asc',
      },
    });
  }

  async findById(id: string): Promise<RouteWithTraveler | null> {
    return await prisma.route.findUnique({
      where: { id },
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteRoute(id: string): Promise<Route> {
    return await prisma.route.delete({
      where: { id },
    });
  }
}
