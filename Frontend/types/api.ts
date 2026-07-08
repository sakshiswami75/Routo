export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorShape {
  success?: boolean;
  message?: string;
  errors?: unknown;
}
