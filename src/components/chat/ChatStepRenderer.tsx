
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { httpClient } from "@/lib/http-client";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface ChatStepRendererProps {
  step: TaskStepDTO;
  onStepClick?: () => void;
  isSelected?: boolean;
}

export const ChatStepRenderer = ({ step, onStepClick, isSelected }: ChatStepRendererProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleDownload = async (taskId: string, documentId: string, filename: string) => {
    console.log("Downloading document:", documentId, "from task:", taskId);
    try {
      const response = await httpClient.get(`/api/tasks/${taskId}/documents/${documentId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadAudio = async (taskId: string, documentId: string) => {
    try {
      const response = await httpClient.get(`/api/tasks/${taskId}/documents/${documentId}`, {
        responseType: 'blob'
      });
      
      const url = URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.load();
      }
    } catch (error) {
      console.error("Error loading audio:", error);
      toast({
        title: "Error",
        description: "Failed to load audio file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const isAudioFile = (filename: string) => {
    return filename.toLowerCase().endsWith('.mp3');
  };

  return (
    <>
      {step.input && (
        <div className="max-w-[80%] p-4 rounded-lg bg-muted">
          {step.input}
        </div>
      )}

      {step.action?.name === "output_message" ? (
        <div 
          className={cn(
            "max-w-[80%] ml-auto p-4 rounded-lg",
            step.result?.error 
              ? "bg-destructive/10 text-foreground hover:bg-destructive/20" 
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            isSelected && "bg-primary/90",
            "cursor-pointer transition-colors"
          )}
          onClick={onStepClick}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {step.action.parameters?.message || step.result?.details || ''}
          </ReactMarkdown>
          {step.result?.error && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <AlertOctagon className="h-4 w-4" />
              <span className="font-medium">Error: {step.result.error}</span>
            </div>
          )}
        </div>
      ) : (
        step.result?.summary && (
          <div 
            className={cn(
              "max-w-[80%] ml-auto p-4 rounded-lg",
              step.result?.error 
                ? "bg-destructive/10 text-foreground hover:bg-destructive/20" 
                : "bg-muted text-muted-foreground hover:bg-muted/80",
              isSelected && "bg-muted/80",
              "cursor-pointer transition-colors"
            )}
            onClick={onStepClick}
          >
            {step.result.summary}
            {step.result?.error && (
              <div className="flex items-center gap-2 mt-2 text-destructive">
                <AlertOctagon className="h-4 w-4" />
                <span className="font-medium">Error: {step.result.error}</span>
              </div>
            )}
          </div>
        )
      )}

      {step.documents && step.documents.length > 0 && (
        <div className="max-w-[80%] ml-auto mt-2 p-4 rounded-lg bg-muted">
          <h4 className="text-sm font-medium mb-2">Attached Documents:</h4>
          <div className="space-y-2">
            {step.documents.map((doc) => (
              <div key={doc.filename} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-between"
                    onClick={() => handleDownload(doc.taskId, doc.filename, doc.filename)}
                  >
                    <span className="truncate">{doc.filename}</span>
                    <Download className="h-4 w-4 ml-2" />
                  </Button>
                  
                  {isAudioFile(doc.filename) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!audioUrl) {
                          loadAudio(doc.taskId, doc.filename);
                        }
                        togglePlayPause();
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {isAudioFile(doc.filename) && (
                  <audio
                    ref={audioRef}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full"
                    controls={false}
                  >
                    {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

