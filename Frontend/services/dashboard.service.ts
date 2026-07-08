import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { DashboardSummary } from "@/types/models";

export const dashboardService = {
  async getDashboard() {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard");
    return data.data;
  }
};
