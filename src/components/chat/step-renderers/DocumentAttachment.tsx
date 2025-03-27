
import { DocumentDTO } from "@/types/api";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
import { httpClient } from "@/lib/http-client";
import { useToast } from "@/components/ui/use-toast";

interface DocumentAttachmentProps {
  document: DocumentDTO;
}

export const DocumentAttachment = ({ document }: DocumentAttachmentProps) => {
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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-between"
          onClick={() => handleDownload(document.taskId, document.filename, document.filename)}
        >
          <span className="truncate">{document.filename}</span>
          <Download className="h-4 w-4 ml-2" />
        </Button>
        
        {isAudioFile(document.filename) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!audioUrl) {
                loadAudio(document.taskId, document.filename);
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
      
      {isAudioFile(document.filename) && (
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
  );
};
