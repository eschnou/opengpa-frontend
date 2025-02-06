import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import chatExamples from "@/config/chat-examples.json";

interface WelcomeChatProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onExampleClick: (body: string) => void;
}

export const WelcomeChat = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onExampleClick,
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
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type your message here..."
            className="resize-none"
            rows={4}
          />
          <Button 
            className="w-full" 
            onClick={onSendMessage}
            disabled={isProcessing}
          >
            <Send className="h-5 w-5 mr-2" />
            {isProcessing ? "Processing..." : "Send message"}
          </Button>
        </div>
      </div>
    </main>
  );
};