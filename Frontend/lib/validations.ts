import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const parcelSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropLocation: z.string().min(3, "Drop location is required"),
  weight: z.number().positive("Weight must be greater than 0"),
  rewardAmount: z.number().positive("Reward must be greater than 0")
});

export const routeSchema = z.object({
  fromCity: z.string().min(1, "Origin is required"),
  toCity: z.string().min(1, "Destination is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  availableCapacity: z.number().positive("Capacity must be greater than 0"),
  travelDate: z.string().min(1, "Travel date is required")
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email")
});

export const reviewSchema = z.object({
  deliveryId: z.string().uuid("Select a delivered delivery"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});
