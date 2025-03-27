
import { useState, useRef, useEffect } from "react";
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { httpClient } from "@/lib/http-client";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { Progress } from "@/components/ui/progress";

export const TextToSpeechRenderer = ({ step }: { step: TaskStepDTO }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Clean up audio URL on unmount
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

  // Update time display and progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Format time in mm:ss
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

      <div className="rounded-lg bg-muted p-4">
        <h3 className="text-sm font-medium mb-2">Input Text:</h3>
        <ReactMarkdown>
          {step.action?.parameters?.input || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
};
