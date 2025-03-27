
import { useState } from "react";
import { DocumentDTO } from "@/types/api";
import { FileText, Image, FileSpreadsheet, FileAudio, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { httpClient } from "@/lib/http-client";

interface DocumentAttachmentProps {
  document: DocumentDTO;
}

export const DocumentAttachment = ({ document }: DocumentAttachmentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const fileExtension = document.filename.split('.').pop()?.toLowerCase();
  const isAudioFile = fileExtension === 'mp3' || fileExtension === 'wav';
  
  // Function to determine icon based on file extension
  const getIcon = () => {
    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      return <Image className="h-4 w-4" />;
    } else if (fileExtension === 'csv') {
      return <FileSpreadsheet className="h-4 w-4" />;
    } else if (isAudioFile) {
      return <FileAudio className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  const handlePlayPause = async () => {
    if (!audio) {
      try {
        // Fetch the audio file if not loaded yet
        const response = await httpClient.get(`/api/tasks/${document.taskId}/documents/${document.filename}`, {
          responseType: 'blob'
        });
        
        const url = URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
        setAudioUrl(url);
        
        const newAudio = new Audio(url);
        newAudio.onended = () => setIsPlaying(false);
        setAudio(newAudio);
        
        newAudio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-md bg-muted/50"
    )}>
      {getIcon()}
      <span className="text-sm truncate">{document.filename}</span>
      
      {isAudioFile && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto h-6 w-6 p-0"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'} audio</span>
        </Button>
      )}
    </div>
  );
};
