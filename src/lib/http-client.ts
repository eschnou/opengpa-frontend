import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
import { APP_CONFIG } from "@/config/app.config";

export const httpClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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