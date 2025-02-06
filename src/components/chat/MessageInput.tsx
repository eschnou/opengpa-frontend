import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square, Paperclip, Camera, X } from "lucide-react";
import { KeyboardEvent, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

interface MessageInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (file?: File) => void;
  onStopProcessing?: () => void;
  className?: string;
  attachedFile?: File | null;
  onFileAttach?: (file: File) => void;
}

export const MessageInput = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onStopProcessing,
  className,
  attachedFile,
  onFileAttach
}: MessageInputProps) => {
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
    if (file && onFileAttach) {
      onFileAttach(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        {attachedFile && (
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate">{attachedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-auto"
              onClick={() => onFileAttach?.(null as any)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="hover:bg-muted"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Screenshot functionality will be available soon",
                });
              }}
              disabled={isProcessing}
              className="hover:bg-muted"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
            disabled={isProcessing}
          />
          {isProcessing && onStopProcessing ? (
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
    </div>
  );
};