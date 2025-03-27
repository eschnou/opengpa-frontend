
import { httpClient } from "@/lib/http-client";

export const fileService = {
  /**
   * Fetches a document as a blob from the API
   * @param taskId The task ID
   * @param filename The document filename
   * @returns A promise that resolves to a Blob
   */
  fetchDocumentAsBlob: async (taskId: string, filename: string): Promise<Blob> => {
    const response = await httpClient.get(`/api/tasks/${taskId}/documents/${filename}`, {
      responseType: 'blob'
    });
    
    return new Blob([response.data], { 
      type: getContentType(filename)
    });
  }
};

/**
 * Determines the content type based on file extension
 */
function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
}
