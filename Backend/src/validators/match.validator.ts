import { z } from 'zod';

export const routeMatchParamSchema = z.object({
  params: z.object({
    routeId: z.string().uuid('Invalid route ID'),
  }),
});
