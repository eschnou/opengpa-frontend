
import { useState, useRef } from "react";
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { httpClient } from "@/lib/http-client";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";

export const TextToSpeechRenderer = ({ step }: { step: TaskStepDTO }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      {step.documents && step.documents.length > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Generated Audio:</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!audioUrl) {
                  loadAudio(step.documents[0].taskId, step.documents[0].filename);
                }
                togglePlayPause();
              }}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
          </div>
          
          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
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
