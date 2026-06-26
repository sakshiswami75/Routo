import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
  }).refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'At least one field is required',
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
