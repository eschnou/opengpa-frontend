
import { httpClient } from "@/lib/http-client";
import { Document } from "@/types/api";

export const workspaceService = {
  uploadDocument: async (taskId: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient.post(`/api/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};
