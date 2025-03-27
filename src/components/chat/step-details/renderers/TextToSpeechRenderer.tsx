
import { useState, useRef, useEffect } from "react";
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Download } from "lucide-react";
import { audioService } from "@/services/audio.service";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScriptItem {
  voice: string;
  text: string;
}

export const TextToSpeechRenderer = ({ step }: { step: TaskStepDTO }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const scriptParam = step.action?.parameters?.script;
  const script = Array.isArray(scriptParam) ? scriptParam as ScriptItem[] : undefined;
  const inputText = step.action?.parameters?.input || '';
  
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const loadAudio = async (taskId: string, documentId: string) => {
    if (audioUrl) return; // Already loaded
    
    setIsLoading(true);
    try {
      const blob = await audioService.fetchDocumentAsBlob(taskId, documentId);
      const url = URL.createObjectURL(blob);
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
    } finally {
      setIsLoading(false);
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

  const handleDownload = async () => {
    if (!step.documents || step.documents.length === 0) return;
    
    try {
      const documentFile = step.documents[0];
      const blob = await audioService.fetchDocumentAsBlob(documentFile.taskId, documentFile.filename);
      
      // Create a hidden download link using the DOM API, not the DocumentDTO
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentFile.filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-4">
      {step.action?.reasoning && (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Reasoning:</h3>
          <p className="text-sm text-muted-foreground">{step.action.reasoning}</p>
        </div>
      )}

      {step.documents && step.documents.length > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Generated Audio:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!audioUrl && step.documents && step.documents.length > 0) {
                    loadAudio(step.documents[0].taskId, step.documents[0].filename);
                  }
                  togglePlayPause();
                }}
                disabled={isLoading}
                className="min-w-24"
              >
                {isLoading ? (
                  "Loading..."
                ) : isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="min-w-24"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {audioUrl && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Volume2 className="h-3.5 w-3.5 mr-1" />
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
              )}
            </div>
            
            {audioUrl && (
              <Progress value={(currentTime / duration) * 100} className="h-1.5" />
            )}
          </div>
          
          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="hidden"
          >
            {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
          </audio>
        </div>
      )}

      {script && script.length > 0 ? (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Conversation Script:</h3>
          <div className="space-y-3">
            {script.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-3 rounded-lg",
                  "border border-border",
                  index % 2 === 0 ? "bg-primary/5" : "bg-secondary/5"
                )}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.voice}
                  </span>
                </div>
                <div className="text-sm">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      ) : inputText ? (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Input Text:</h3>
          <ReactMarkdown>
            {inputText}
          </ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
};
