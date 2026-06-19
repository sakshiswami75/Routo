import { z } from 'zod';

export const acceptDeliverySchema = z.object({
  body: z.object({
    parcelId: z.string().uuid('Invalid parcel ID'),
  }),
});

export const deliveryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid delivery ID'),
  }),
});

export type AcceptDeliveryInput = z.infer<typeof acceptDeliverySchema>['body'];
export type DeliveryIdParam = z.infer<typeof deliveryIdParamSchema>['params'];
