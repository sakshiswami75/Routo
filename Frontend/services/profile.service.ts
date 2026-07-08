import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { UpdateProfileInput } from "@/types/forms";
import type { User } from "@/types/models";

export const profileService = {
  async getMe() {
    const { data } = await apiClient.get<ApiResponse<User>>("/profile/me");
    return data.data;
  },
  async updateMe(input: UpdateProfileInput) {
    const { data } = await apiClient.patch<ApiResponse<User>>("/profile/me", input);
    return data.data;
  }
};
