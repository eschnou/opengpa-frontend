
import { httpClient } from "@/lib/http-client";

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

type ValidationError = {
  path: string;
  message: string;
  statusCode: number;
  timestamp: string;
  validationErrors: Record<string, string>;
};

export const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await httpClient.put("/users/me/password", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.validationErrors) {
      throw error.response.data;
    }
    throw error;
  }
};

