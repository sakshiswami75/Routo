import { z } from 'zod';

export const acceptDeliverySchema = z.object({
  body: z.object({
    parcelId: z.string().uuid('Invalid parcel ID'),
  }),
});

export const markDeliveredSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid delivery ID'),
  }),
});

export type AcceptDeliveryInput = z.infer<typeof acceptDeliverySchema>['body'];
export type MarkDeliveredParams = z.infer<typeof markDeliveredSchema>['params'];
