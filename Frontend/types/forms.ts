export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface CreateParcelInput {
  title: string;
  description?: string;
  pickupLocation: string;
  dropLocation: string;
  weight: number;
  rewardAmount: number;
}

export interface CreateRouteInput {
  fromCity: string;
  toCity: string;
  vehicleType: string;
  availableCapacity: number;
  travelDate: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export interface CreateReviewInput {
  deliveryId: string;
  rating: number;
  comment?: string;
}
