import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { CreateReviewInput } from "@/types/forms";
import type { Review } from "@/types/models";

export const reviewService = {
  async create(input: CreateReviewInput) {
    const { data } = await apiClient.post<ApiResponse<Review>>("/reviews", input);
    return data.data;
  },
  async getMyReviews() {
    const { data } = await apiClient.get<ApiResponse<Review[]>>("/reviews/me");
    return data.data;
  },
  async getCarrierReviews(carrierId: string) {
    const { data } = await apiClient.get<ApiResponse<Review[]>>(`/reviews/carrier/${carrierId}`);
    return data.data;
  }
};
