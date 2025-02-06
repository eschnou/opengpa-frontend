import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square } from "lucide-react";
import { KeyboardEvent } from "react";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onStopProcessing: () => void;
}

export const ChatInput = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onStopProcessing,
}: ChatInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing && message.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none"
          rows={1}
          disabled={isProcessing}
        />
        {isProcessing ? (
          <Button 
            variant="destructive"
            className="shrink-0" 
            onClick={onStopProcessing}
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            className="shrink-0" 
            onClick={onSendMessage}
            disabled={isProcessing}
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};