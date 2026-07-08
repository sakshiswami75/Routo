export type ParcelStatus = "PENDING" | "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
export type DeliveryStatus = "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Parcel {
  id: string;
  title: string;
  description?: string | null;
  pickupLocation: string;
  dropLocation: string;
  status: ParcelStatus;
  weight: number;
  rewardAmount: number;
  senderId: string;
  sender?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleType: string;
  availableCapacity: number;
  travelDate: string;
  travelerId: string;
  traveler?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  parcelId: string;
  carrierId: string;
  status: DeliveryStatus;
  acceptedAt: string;
  deliveredAt?: string | null;
  parcel?: Parcel;
  carrier?: User;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  senderId: string;
  carrierId: string;
  deliveryId: string;
  createdAt: string;
  sender?: User;
  carrier?: User;
  delivery?: Delivery;
}

export interface DashboardSummary {
  user: User;
  sender: {
    totalParcels: number;
    pendingParcels: number;
    acceptedParcels: number;
    inTransitParcels: number;
    deliveredParcels: number;
    recentParcels: Parcel[];
  };
  carrier: {
    totalRoutes: number;
    totalAcceptedDeliveries: number;
    deliveriesInTransit: number;
    completedDeliveries: number;
    averageRating: number;
    recentDeliveries: Delivery[];
  };
}
