import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api";
import type { LoginInput, RegisterInput } from "@/types/forms";
import type { User } from "@/types/models";

export interface AuthSession {
  user: User;
  token: string;
}

export const authService = {
  async login(input: LoginInput) {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", input);
    return data.data;
  },
  async register(input: RegisterInput) {
    const { data } = await apiClient.post<ApiResponse<User>>("/auth/register", input);
    return data.data;
  }
};
