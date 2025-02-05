import { httpClient } from "@/lib/http-client";
import type { AuthRequest, AuthResponse } from "@/types/api";
import { setToken, removeToken } from "@/utils/token";

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  logout() {
    removeToken();
  }
};