export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfileDTO;
}

export interface UserProfileDTO {
  id: string;
  username: string;
  name: string;
  email: string;
}