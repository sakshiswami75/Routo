import { z } from 'zod';

export const createParcelSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    pickupLocation: z.string().min(3, 'Pickup location is required'),
    dropLocation: z.string().min(3, 'Drop location is required'),
    weight: z.number().positive('Weight must be greater than 0'),
    rewardAmount: z.number().positive('Reward amount must be greater than 0'),
  }),
});

export type CreateParcelInput = z.infer<typeof createParcelSchema>['body'];
