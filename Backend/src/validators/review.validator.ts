import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    deliveryId: z.string().uuid('Invalid delivery ID'),
    rating: z.number().int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().optional(),
  }),
});

export const carrierReviewParamSchema = z.object({
  params: z.object({
    carrierId: z.string().uuid('Invalid carrier ID'),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type CarrierReviewParam = z.infer<typeof carrierReviewParamSchema>['params'];
