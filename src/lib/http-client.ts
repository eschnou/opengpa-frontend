import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
import { APP_CONFIG } from "@/config/app.config";

console.log('Initializing HTTP client with API URL:', APP_CONFIG.apiUrl);

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
    console.log('Adding token to request:', token ? 'Token present' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 responses
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      console.log('Unauthorized response detected, logging out');
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);