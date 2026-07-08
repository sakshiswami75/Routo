import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { CreateRouteInput } from "@/types/forms";
import type { Parcel, Route } from "@/types/models";

export const routeService = {
  async create(input: CreateRouteInput) {
    const { data } = await apiClient.post<ApiResponse<Route>>("/routes", input);
    return data.data;
  },
  async getMyRoutes() {
    const { data } = await apiClient.get<ApiResponse<Route[]>>("/routes/my");
    return data.data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Route>>(`/routes/${id}`);
    return data.data;
  },
  async delete(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/routes/${id}`);
  },
  async getMatches(routeId: string) {
    const { data } = await apiClient.get<ApiResponse<Parcel[]>>(`/routes/${routeId}/matches`);
    return data.data;
  }
};
