import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square, Paperclip } from "lucide-react";
import { KeyboardEvent, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (file?: File) => void;
  onStopProcessing: () => void;
}

export const ChatInput = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onStopProcessing,
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing && message.trim()) {
        onSendMessage();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      onSendMessage(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
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
            onClick={() => onSendMessage()}
            disabled={isProcessing}
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};