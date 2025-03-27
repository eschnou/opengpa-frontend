
export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  inviteCode?: string;
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
  stateData?: Record<string, string>; // Added stateData for AWAITING_INPUT status
}

export interface DocumentDTO {
  taskId: string;
  filename: string;
}

export interface TaskStepDTO {
  id: string;
  taskId: string;
  input: string;
  action?: ActionDTO;
  result: ResultDTO;
  created: string;
  documents?: DocumentDTO[];
}

export interface Document {
  workspaceId: string;
  name: string;
  metadata: Record<string, string>;
}

export interface RagDocumentDTO {
  id: string;
  filename: string;
  title: string;
  description: string;
  contentType: string;
  progress: number;
}

export interface RagChunkDTO {
  id: string;
  documentId: string;
  documentTitle: string;
  documentDescription: string;
  content: string;
}

// Add the CategoryInfoDTO interface
export interface CategoryInfoDTO {
  name: string;
  displayName?: string;
  description?: string;
}
