import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square } from "lucide-react";

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
  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type your message..."
          className="resize-none"
          rows={1}
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