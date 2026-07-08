import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { CreateParcelInput } from "@/types/forms";
import type { Parcel } from "@/types/models";

export const parcelService = {
  async create(input: CreateParcelInput) {
    const { data } = await apiClient.post<ApiResponse<Parcel>>("/parcels", input);
    return data.data;
  },
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<Parcel[]>>("/parcels");
    return data.data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Parcel>>(`/parcels/${id}`);
    return data.data;
  },
  async getTravelerMatches() {
    const { data } = await apiClient.get<ApiResponse<Parcel[]>>("/parcels/matches");
    return data.data;
  }
};
