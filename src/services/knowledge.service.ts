
import { httpClient } from "@/lib/http-client";
import { RagDocumentDTO, RagChunkDTO } from "@/types/api";

export const knowledgeService = {
  listDocuments: async (): Promise<RagDocumentDTO[]> => {
    const response = await httpClient.get("/api/documents");
    return response.data;
  },

  getDocument: async (documentId: string): Promise<RagDocumentDTO> => {
    const response = await httpClient.get(`/api/documents/${documentId}`);
    return response.data;
  },

  getDocumentChunks: async (documentId: string): Promise<RagChunkDTO[]> => {
    const response = await httpClient.get(`/api/documents/${documentId}/chunks`);
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await httpClient.delete(`/api/documents/${documentId}`);
  },

  uploadDocument: async (title: string, description: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient.post(`/api/documents?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

