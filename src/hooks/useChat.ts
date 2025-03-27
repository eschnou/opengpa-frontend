
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { createTask } from "@/services/task.service";
import { workspaceService } from "@/services/workspace.service";
import { fetchTask, fetchTaskSteps } from "@/services/taskSteps.service";
import { useFileAttachments } from "@/hooks/useFileAttachments";
import { useTaskProcessing } from "@/hooks/useTaskProcessing";
import { useChatCategories } from "@/hooks/useChatCategories";

export const useChat = (taskId?: string, onTaskCreated?: (taskId: string) => void) => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Import functionality from smaller hooks
  const {
    attachedFiles,
    isUploading,
    uploadProgress,
    setAttachedFiles,
    setIsUploading,
    setUploadProgress,
    handleFileAttachment
  } = useFileAttachments();

  const {
    isProcessing,
    isStopping,
    isAwaitingInput,
    stopProcessingRef,
    setIsProcessing,
    setIsAwaitingInput,
    handleStopProcessing,
    processTaskLoop,
    handleConfirmInput: processConfirmInput,
    handleCancelInput: processCancelInput
  } = useTaskProcessing();

  const {
    enabledCategories,
    handleCategoriesChange
  } = useChatCategories();

  // Fetch task and steps
  const { data: task } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(taskId!),
    enabled: !!taskId,
  });

  const { data: steps, isLoading } = useQuery({
    queryKey: ["taskSteps", taskId],
    queryFn: () => fetchTaskSteps(taskId!),
    enabled: !!taskId,
  });

  // Handle sending messages
  const handleSendMessage = async (files?: File[]) => {
    const filesToUpload = files || attachedFiles || [];
    
    if ((!message.trim() && filesToUpload.length === 0) || isProcessing) return;

    setIsProcessing(true);
    setIsUploading(filesToUpload.length > 0);
    stopProcessingRef.current = false;
    setIsStopping(false);
    const currentMessage = message;
    setMessage("");
    
    try {
      console.log("Starting to process message...", { 
        fileCount: filesToUpload.length,
        enabledCategories: enabledCategories
      });
      
      let currentTaskId = taskId;
      
      if (!currentTaskId) {
        console.log("Creating new task...");
        const newTask = await createTask(currentMessage, enabledCategories.length > 0 ? enabledCategories : undefined);
        console.log("Task created successfully:", newTask);
        currentTaskId = newTask.id;
        
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        
        if (onTaskCreated) {
          onTaskCreated(newTask.id);
        }
        
        handleCategoriesChange([]);
      }

      if (filesToUpload.length > 0) {
        console.log(`Uploading ${filesToUpload.length} file(s) sequentially...`);
        setUploadProgress(0);
        
        try {
          const uploadedDocs = await workspaceService.uploadMultipleDocuments(
            currentTaskId, 
            filesToUpload,
            (progress) => {
              setUploadProgress(progress);
              console.log(`Upload progress: ${progress}%`);
            }
          );
          
          toast({
            title: "Files uploaded",
            description: `${uploadedDocs.length} file(s) uploaded successfully.`,
          });
          
          setAttachedFiles(null);
          setUploadProgress(100);
        } catch (error) {
          console.error("Error uploading files:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload one or more files. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(false);
      await processTaskLoop(currentTaskId, currentMessage);
    } catch (error) {
      console.error("Error processing task:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (!isAwaitingInput) {
        setIsProcessing(false);
      }
      setIsUploading(false);
      stopProcessingRef.current = false;
      setIsStopping(false);
      setUploadProgress(0);
    }
  };

  // Wrapper for confirm input
  const handleConfirmInput = (taskId: string, stateData: Record<string, string>) => {
    return processConfirmInput(taskId, stateData);
  };

  // Wrapper for cancel input
  const handleCancelInput = () => {
    if (taskId) {
      return processCancelInput(taskId);
    }
  };

  return {
    message,
    setMessage,
    attachedFiles,
    handleFileAttachment,
    isProcessing,
    isUploading,
    isStopping,
    isAwaitingInput,
    uploadProgress,
    task,
    steps,
    isLoading,
    handleStopProcessing,
    handleSendMessage,
    handleConfirmInput,
    handleCancelInput,
    enabledCategories,
    handleCategoriesChange,
  };
};
