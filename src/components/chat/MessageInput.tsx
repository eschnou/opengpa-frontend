import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square, Paperclip, Camera, X } from "lucide-react";
import { KeyboardEvent, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

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
      // Check file type
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (!['txt', 'csv'].includes(fileType || '')) {
        toast({
          title: "Invalid file type",
          description: "Only .txt and .csv files are allowed",
          variant: "destructive",
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      onFileAttach(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScreenshot = async () => {
    try {
      // Request screen capture with standard options
      const stream = await navigator.mediaDevices.getDisplayMedia();
      
      // Create video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video to load
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(null);
        };
      });

      // Create canvas to draw the screenshot
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );
      
      // Create file from blob
      const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
      
      // Use existing file attachment logic
      if (onFileAttach) {
        onFileAttach(file);
        toast({
          title: "Screenshot captured",
          description: "Your screenshot has been attached successfully.",
        });
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast({
          title: "Permission denied",
          description: "You need to allow screen capture to take a screenshot.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Screenshot failed",
          description: "Failed to capture screenshot. Please try again.",
          variant: "destructive",
        });
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
              className="h-4 w-4 ml-auto hover:bg-background/50"
              onClick={() => onFileAttach?.(null as any)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex gap-2 items-start">
          <div className="flex gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="hover:bg-muted h-[44px] w-[44px]"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach .txt or .csv file</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleScreenshot}
                  disabled={isProcessing}
                  className="hover:bg-muted h-[44px] w-[44px]"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Take screenshot</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none pr-12 min-h-[44px] max-h-[400px] overflow-y-auto"
              rows={1}
              disabled={isProcessing}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.csv"
            />
            <div className="absolute right-2 bottom-1.5">
              {isProcessing && onStopProcessing ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onStopProcessing}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Stop processing</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onSendMessage()}
                      disabled={isProcessing || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};