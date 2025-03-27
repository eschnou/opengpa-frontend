
import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
import { APP_CONFIG } from "@/config/app.config";

export const httpClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication endpoints that should not include the token
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

// Add auth token to requests, but exclude auth endpoints
httpClient.interceptors.request.use(
  (config) => {
    // Don't add auth token for authentication endpoints
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (!isAuthEndpoint) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
