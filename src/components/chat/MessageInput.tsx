
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
  onSendMessage: (files?: File[]) => void;
  onStopProcessing?: () => void;
  className?: string;
  attachedFiles?: File[] | null;
  onFileAttach?: (files: File[] | null) => void;
  isNewTask?: boolean;
}

export const MessageInput = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onStopProcessing,
  className,
  attachedFiles = [],
  onFileAttach,
  isNewTask = false
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
      if (!isProcessing && (message.trim() || (attachedFiles && attachedFiles.length > 0))) {
        onSendMessage(attachedFiles || []);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileAttach) {
      const fileArray = Array.from(files);
      
      // Check file types
      const invalidFiles = fileArray.filter(file => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        return !['txt', 'csv', 'jpg', 'jpeg', 'png', 'pdf'].includes(fileType || '');
      });
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid file type(s)",
          description: "Only .txt, .csv, .jpg, .png and .pdf files are allowed",
          variant: "destructive",
        });
        
        // If there are some valid files, continue with those
        if (invalidFiles.length < fileArray.length) {
          const validFiles = fileArray.filter(file => {
            const fileType = file.name.split('.').pop()?.toLowerCase();
            return ['txt', 'csv', 'jpg', 'jpeg', 'png', 'pdf'].includes(fileType || '');
          });
          onFileAttach(validFiles);
        }
      } else {
        // All files are valid
        onFileAttach(fileArray);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearFiles = () => {
    if (onFileAttach) {
      onFileAttach(null);
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
        const currentFiles = attachedFiles || [];
        onFileAttach([...currentFiles, file]);
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

  const removeFile = (index: number) => {
    if (attachedFiles && onFileAttach) {
      const newFiles = [...attachedFiles];
      newFiles.splice(index, 1);
      onFileAttach(newFiles.length > 0 ? newFiles : null);
    }
  };

  return (
    <div className={className}>
      <div className={`flex flex-col gap-2 ${!isNewTask ? "border-t border-l border-r border-border rounded-t-lg bg-card/50" : ""}`}>
        {attachedFiles && attachedFiles.length > 0 && (
          <div className="flex flex-col gap-2 px-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{attachedFiles.length} file{attachedFiles.length !== 1 ? 's' : ''} attached</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={handleClearFiles}
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <Paperclip className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs truncate max-w-44">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-background/50"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 items-start p-3">
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
              <TooltipContent>Attach files (.txt, .csv, .jpg, .png or .pdf)</TooltipContent>
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
              accept=".txt,.csv,.jpg,.jpeg,.png,.pdf"
              multiple
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
                      onClick={() => onSendMessage(attachedFiles || [])}
                      disabled={isProcessing || (!message.trim() && (!attachedFiles || attachedFiles.length === 0))}
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
