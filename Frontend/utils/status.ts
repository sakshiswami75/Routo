import type { DeliveryStatus, ParcelStatus } from "@/types/models";

export function statusTone(status: ParcelStatus | DeliveryStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-200";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PICKED_UP":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "ACCEPTED":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
}
