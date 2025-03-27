
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useFileAttachments = () => {
  const [attachedFiles, setAttachedFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileAttachment = (files: File[] | null) => {
    console.log("Handling file attachment:", files?.length);
    
    if (!files) {
      setAttachedFiles(null);
      return;
    }
    
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024); // 10MB limit
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversizedFiles.length} file(s) exceed the 10MB limit and were removed`,
        variant: "destructive",
      });
      
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
      setAttachedFiles(validFiles.length > 0 ? validFiles : null);
      
      if (validFiles.length > 0) {
        toast({
          title: "Files attached",
          description: `${validFiles.length} file(s) will be uploaded when you send your message.`,
        });
      }
    } else {
      setAttachedFiles(files);
      toast({
        title: "Files attached",
        description: `${files.length} file(s) will be uploaded when you send your message.`,
      });
    }
  };

  return {
    attachedFiles,
    isUploading,
    uploadProgress,
    setAttachedFiles,
    setIsUploading,
    setUploadProgress,
    handleFileAttachment
  };
};
