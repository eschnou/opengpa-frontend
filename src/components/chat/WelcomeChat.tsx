import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import chatExamples from "@/config/chat-examples.json";
import { MessageInput } from "./MessageInput";

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
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Welcome to Chat</h2>
        <div className="max-w-md space-y-4 text-center">
          <p className="text-muted-foreground">Here are some examples of what you can ask:</p>
          <ul className="space-y-3 text-sm">
            {chatExamples.examples.map((example, index) => (
              <li 
                key={index} 
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onExampleClick(example.body)}
              >
                "{example.title}"
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full max-w-md space-y-4">
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