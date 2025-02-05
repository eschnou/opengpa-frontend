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

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  created: string;
  completed: string | null;
  context: Record<string, string>;
}