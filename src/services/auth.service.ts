import { httpClient } from "@/lib/http-client";
import type { AuthRequest, AuthResponse, RegisterRequest } from "@/types/api";
import { setToken, removeToken } from "@/utils/token";

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    console.log('Attempting login with username:', credentials.username);
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response received:', response.status);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('Attempting registration for username:', data.username);
    try {
      const response = await httpClient.post<AuthResponse>('/auth/register', data);
      console.log('Registration response received:', response.status);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout() {
    console.log('Logging out user');
    removeToken();
  }
};