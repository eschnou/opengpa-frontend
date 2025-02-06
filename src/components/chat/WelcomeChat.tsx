import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import chatExamples from "@/config/chat-examples.json";

interface WelcomeChatProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (file?: File) => void;
  onExampleClick: (body: string) => void;
  attachedFile?: File | null;
  onFileAttach?: (file: File | null) => void;
}

export const WelcomeChat = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onExampleClick,
  attachedFile,
  onFileAttach,
}: WelcomeChatProps) => {
  return (
    <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 max-w-3xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-foreground">Welcome to Chat</h2>
        <div className="w-full space-y-6">
          <p className="text-xl text-muted-foreground text-center">
            Here are some examples of what you can ask:
          </p>
          <div className="space-y-4 w-full">
            {chatExamples.examples.map((example, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(example.body)}
                className="w-full p-4 bg-muted hover:bg-accent transition-colors rounded-xl text-left group relative"
              >
                <span className="text-lg font-medium text-foreground">
                  "{example.title}"
                </span>
                <div className="mt-2 text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
                  {example.body}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <MessageInput
            message={message}
            isProcessing={isProcessing}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            attachedFile={attachedFile}
            onFileAttach={onFileAttach}
          />
        </div>
      </div>
    </main>
  );
};