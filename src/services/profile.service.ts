
import { httpClient } from "@/lib/http-client";
import { UserProfileDTO } from "@/types/api";

// Using a type that matches the structure of what we're sending to the API
type UpdateProfileData = {
  name: string;
  email: string;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfileDTO> => {
  const response = await httpClient.patch<UserProfileDTO>("/users/me", data);
  return response.data;
};
