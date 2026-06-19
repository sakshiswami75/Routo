import { z } from 'zod';

export const createRouteSchema = z.object({
  body: z.object({
    fromCity: z.string().min(1, 'fromCity is required'),
    toCity: z.string().min(1, 'toCity is required'),
    vehicleType: z.string().min(1, 'vehicleType is required'),
    availableCapacity: z.number().positive('Available capacity must be greater than 0'),
    travelDate: z.string().min(1, 'travelDate is required').refine((dateString) => {
      const travelDate = new Date(dateString);
      return travelDate > new Date();
    }, { message: 'Travel date must be a future date' }),
  }),
});

export const routeIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid route ID'),
  }),
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>['body'];
export type RouteIdParam = z.infer<typeof routeIdParamSchema>['params'];
