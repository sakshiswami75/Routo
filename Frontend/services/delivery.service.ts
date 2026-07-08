import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { Delivery } from "@/types/models";

export const deliveryService = {
  async accept(parcelId: string) {
    const { data } = await apiClient.post<ApiResponse<Delivery>>("/deliveries/accept", { parcelId });
    return data.data;
  },
  async getMyDeliveries() {
    const { data } = await apiClient.get<ApiResponse<Delivery[]>>("/deliveries/my");
    return data.data;
  },
  async markPickedUp(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Delivery>>(`/deliveries/${id}/pickup`);
    return data.data;
  },
  async markInTransit(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Delivery>>(`/deliveries/${id}/in-transit`);
    return data.data;
  },
  async markDelivered(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Delivery>>(`/deliveries/${id}/deliver`);
    return data.data;
  }
};
