
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
  
  uploadMultipleDocuments: async (taskId: string, files: File[], onProgress?: (progress: number) => void): Promise<Document[]> => {
    if (files.length === 0) {
      return [];
    }
    
    // Sequential upload instead of parallel to prevent race conditions
    const documents: Document[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const document = await workspaceService.uploadDocument(taskId, files[i]);
        documents.push(document);
        
        // Calculate and report progress if callback is provided
        if (onProgress) {
          const progress = Math.round(((i + 1) / files.length) * 100);
          onProgress(progress);
        }
      } catch (error) {
        console.error(`Error uploading file ${files[i].name}:`, error);
        throw error; // Re-throw to handle in the calling function
      }
    }
    
    return documents;
  }
};
