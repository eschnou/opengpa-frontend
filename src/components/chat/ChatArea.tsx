import { ChatStepRenderer } from "./ChatStepRenderer";
import { LoadingIndicator } from "./LoadingIndicator";
import { WelcomeChat } from "./WelcomeChat";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

interface ChatAreaProps {
  taskId?: string;
  onTaskCreated?: (taskId: string) => void;
}

export const ChatArea = ({ taskId, onTaskCreated }: ChatAreaProps) => {
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

  if (!taskId) {
    return (
      <WelcomeChat
        message={message}
        isProcessing={isProcessing}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onExampleClick={setMessage}
        attachedFile={attachedFile}
        onFileAttach={handleFileAttachment}
      />
    );
  }

  return (
    <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground p-4">
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
                <ChatStepRenderer step={step} />
              </div>
            ))}

            {isProcessing && <LoadingIndicator stopping={isStopping} />}
          </>
        )}
      </div>
      
      <ChatInput
        message={message}
        isProcessing={isProcessing}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onStopProcessing={handleStopProcessing}
        attachedFile={attachedFile}
        onFileAttach={handleFileAttachment}
      />
    </main>
  );
};