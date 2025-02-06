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
  request: string;
}

export interface ActionDTO {
  name: string;
  parameters?: Record<string, string>;
  reasoning?: string;
  final?: boolean;
}

export interface ResultDTO {
  status: string;
  details?: any;
  summary: string;
  error?: string;
  message?: string;
  final?: boolean;
}

export interface TaskStepDTO {
  id: string;
  taskId: string;
  input: string;
  action?: ActionDTO;
  result: ResultDTO;
  created: string;
}

export interface Document {
  workspaceId: string;
  name: string;
  metadata: Record<string, string>;
}