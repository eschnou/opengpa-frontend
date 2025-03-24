
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
  },
  
  uploadMultipleDocuments: async (taskId: string, files: File[]): Promise<Document[]> => {
    if (files.length === 0) {
      return [];
    }
    
    if (files.length === 1) {
      // Single file upload uses the existing method
      const document = await workspaceService.uploadDocument(taskId, files[0]);
      return [document];
    }
    
    // Multiple file upload handling
    const uploadPromises = files.map(file => {
      return workspaceService.uploadDocument(taskId, file);
    });
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw error;
    }
  }
};
