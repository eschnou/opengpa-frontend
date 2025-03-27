
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { progressTask, progressTaskWithStateData, progressTaskWithEmptyPayload } from "@/services/task.service";

export const useTaskProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const stopProcessingRef = useRef(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStopProcessing = () => {
    console.log("Stop processing requested");
    stopProcessingRef.current = true;
    setIsStopping(true);
  };

  const processTaskLoop = async (taskId: string, initialMessage?: string) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

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
      
      const currentStep = await progressTask(taskId, attempts === 1 ? initialMessage : undefined);
      console.log(`Task progress attempt ${attempts}:`, currentStep);
      
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      if (currentStep.result?.status === "AWAITING_INPUT") {
        console.log("Task is awaiting user input");
        setIsAwaitingInput(true);
        setIsProcessing(false);
        return; // Exit the loop and wait for user confirmation
      }
      
      if (currentStep.action?.final || currentStep.result?.final) {
        console.log("Task completed with final step");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        ]);
        break;
      }
    }
  };

  const handleConfirmInput = async (taskId: string, stateData: Record<string, string>) => {
    if (!taskId) {
      console.error("Cannot confirm input: taskId is undefined");
      toast({
        title: "Error",
        description: "Cannot process input without a valid task ID",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    console.log("Confirming input with state data:", stateData);
    setIsProcessing(true);
    setIsAwaitingInput(false);
    
    try {
      const step = await progressTaskWithStateData(taskId, stateData);
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      if (step.action?.final || step.result?.final) {
        console.log("Task completed with final step after input confirmation");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        ]);
        setIsProcessing(false);
        return;
      }
      
      if (step.result?.status !== "AWAITING_INPUT") {
        await processTaskLoop(taskId);
      } else {
        setIsAwaitingInput(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error confirming input:", error);
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleCancelInput = async (taskId: string) => {
    if (!taskId) {
      console.error("Cannot cancel input: taskId is undefined");
      toast({
        title: "Error",
        description: "Cannot cancel without a valid task ID",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Input cancelled by user, sending empty payload");
    setIsProcessing(true);
    setIsAwaitingInput(false);
    
    try {
      const step = await progressTaskWithEmptyPayload(taskId);
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      toast({
        title: "Input cancelled",
        description: "You can continue the conversation by sending a new message.",
      });
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error cancelling input:", error);
      toast({
        title: "Error",
        description: "Failed to cancel. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    isStopping,
    isAwaitingInput,
    stopProcessingRef,
    setIsProcessing,
    setIsStopping,
    setIsAwaitingInput,
    handleStopProcessing,
    processTaskLoop,
    handleConfirmInput,
    handleCancelInput
  };
};
