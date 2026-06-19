import { Parcel, Route } from '@prisma/client';
import { prisma } from '../config/prisma';

export class MatchRepository {
  async findMatchesForRoute(route: Route): Promise<Parcel[]> {
    return await prisma.parcel.findMany({
      where: {
        pickupLocation: { equals: route.fromCity, mode: 'insensitive' },
        dropLocation: { equals: route.toCity, mode: 'insensitive' },
        status: 'PENDING',
        senderId: { not: route.travelerId },
        weight: { lte: route.availableCapacity }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findMatchesForAllRoutes(routes: Route[], travelerId: string): Promise<Parcel[]> {
    if (routes.length === 0) return [];
    
    return await prisma.parcel.findMany({
      where: {
        status: 'PENDING',
        senderId: { not: travelerId },
        OR: routes.map(route => ({
          pickupLocation: { equals: route.fromCity, mode: 'insensitive' },
          dropLocation: { equals: route.toCity, mode: 'insensitive' },
          weight: { lte: route.availableCapacity }
        }))
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
