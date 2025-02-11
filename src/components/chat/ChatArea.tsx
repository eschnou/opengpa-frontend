
import { useEffect, useRef } from "react";
import { ChatStepRenderer } from "./ChatStepRenderer";
import { LoadingIndicator } from "./LoadingIndicator";
import { WelcomeChat } from "./WelcomeChat";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { TaskStepDTO } from "@/types/api";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { StepDetails } from "./StepDetails";

interface ChatAreaProps {
  taskId?: string;
  onTaskCreated?: (taskId: string) => void;
  selectedStep: TaskStepDTO | null;
  onStepSelect: (step: TaskStepDTO | null) => void;
}

export const ChatArea = ({ taskId, onTaskCreated, selectedStep, onStepSelect }: ChatAreaProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    message,
    setMessage,
    attachedFile,
    handleFileAttachment,
    isProcessing,
    task,
    steps,
    isLoading,
    isStopping,
    handleStopProcessing,
    handleSendMessage,
  } = useChat(taskId, onTaskCreated);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [steps, isProcessing]);

  if (!taskId) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 overflow-y-auto p-4 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <WelcomeChat
              message={message}
              isProcessing={isProcessing}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              onExampleClick={setMessage}
              attachedFile={attachedFile}
              onFileAttach={handleFileAttachment}
              isNewTask={true}
            />
          </div>
        </div>
      </div>
    );
  }

  const chatContent = (
    <div className="w-full space-y-4 min-w-0 max-w-3xl mx-auto">
      {isLoading ? (
        <div className="w-full text-center text-muted-foreground p-4">
          Loading conversation...
        </div>
      ) : (
        <>
          {task?.title && (
            <div className="max-w-[80%] p-4 rounded-lg glass">
              <h2 className="text-xl font-semibold text-foreground">{task.title}</h2>
            </div>
          )}
          
          {steps?.map((step, index) => (
            <div key={`${step.id}-${index}`} className="space-y-4">
              <ChatStepRenderer 
                step={step} 
                onStepClick={() => onStepSelect(step)}
                isSelected={selectedStep?.id === step.id}
              />
            </div>
          ))}

          {isProcessing && <LoadingIndicator stopping={isStopping} />}
        </>
      )}
    </div>
  );

  const chatInputComponent = (
    <div className="w-full max-w-3xl mx-auto">
      <ChatInput
        message={message}
        isProcessing={isProcessing}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onStopProcessing={handleStopProcessing}
        attachedFile={attachedFile}
        onFileAttach={handleFileAttachment}
        isNewTask={false}
      />
    </div>
  );

  if (!selectedStep) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 overflow-y-auto p-4 w-full flex justify-center">
          {chatContent}
        </div>
        {chatInputComponent}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={70} className="min-w-0">
          <div className="h-full overflow-y-auto p-4 w-full flex justify-center">
            {chatContent}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="w-px bg-border" />
        <ResizablePanel defaultSize={30}>
          <StepDetails step={selectedStep} onClose={() => onStepSelect(null)} />
        </ResizablePanel>
      </ResizablePanelGroup>
      {chatInputComponent}
    </div>
  );
};
