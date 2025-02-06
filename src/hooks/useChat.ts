import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { TaskStepDTO, TaskDTO } from "@/types/api";
import { httpClient } from "@/lib/http-client";
import { createTask, progressTask } from "@/services/task.service";

const fetchTaskSteps = async (taskId: string): Promise<TaskStepDTO[]> => {
  console.log("Fetching steps for task:", taskId);
  const response = await httpClient.get(`/api/tasks/${taskId}/steps`);
  console.log("Steps fetched:", response.data);
  return response.data;
};

const fetchTask = async (taskId: string): Promise<TaskDTO> => {
  console.log("Fetching task:", taskId);
  const response = await httpClient.get(`/api/tasks/${taskId}`);
  console.log("Task fetched:", response.data);
  return response.data;
};

export const useChat = (taskId?: string, onTaskCreated?: (taskId: string) => void) => {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const stopProcessingRef = useRef(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const handleStopProcessing = () => {
    console.log("Stop processing requested");
    stopProcessingRef.current = true;
    setIsStopping(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    stopProcessingRef.current = false;
    setIsStopping(false);
    
    try {
      console.log("Starting to create task...");
      
      const newTask = await createTask(message);
      console.log("Task created successfully:", newTask);
      
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (onTaskCreated) {
        onTaskCreated(newTask.id);
      }

      let currentStep: TaskStepDTO | undefined;
      let attempts = 0;
      const MAX_ATTEMPTS = 5;

      while (attempts < MAX_ATTEMPTS) {
        if (stopProcessingRef.current) {
          console.log("Stopping task processing as requested");
          toast({
            title: "Processing stopped",
            description: "Task processing was stopped as requested.",
          });
          break;
        }

        attempts++;
        console.log(`Starting progress attempt ${attempts}`);
        
        currentStep = await progressTask(newTask.id);
        console.log(`Task progress attempt ${attempts}:`, currentStep);
        
        await queryClient.invalidateQueries({ queryKey: ["taskSteps", newTask.id] });
        
        if (currentStep.action?.final || currentStep.result?.final) {
          console.log("Task completed with final step");
          await queryClient.invalidateQueries({ queryKey: ["tasks"] });
          break;
        }
      }

      setMessage("");
    } catch (error) {
      console.error("Error processing task:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      stopProcessingRef.current = false;
      setIsStopping(false);
    }
  };

  return {
    message,
    setMessage,
    isProcessing,
    isStopping,
    task,
    steps,
    isLoading,
    handleStopProcessing,
    handleSendMessage,
  };
};