import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { httpClient } from "@/lib/http-client";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface ChatStepRendererProps {
  step: TaskStepDTO;
  onStepClick?: () => void;
  isSelected?: boolean;
}

export const ChatStepRenderer = ({ step, onStepClick, isSelected }: ChatStepRendererProps) => {
  const { toast } = useToast();

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
            "max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground prose prose-invert cursor-pointer transition-colors hover:bg-primary/90",
            isSelected && "bg-primary/90"
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
        </div>
      ) : (
        step.result?.summary && (
          <div 
            className={cn(
              "max-w-[80%] ml-auto p-4 rounded-lg bg-muted text-muted-foreground cursor-pointer transition-colors hover:bg-muted/80",
              isSelected && "bg-muted/80"
            )}
            onClick={onStepClick}
          >
            {step.result.summary}
          </div>
        )
      )}

      {step.result?.error && (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-destructive text-destructive-foreground">
          {step.result.error}
        </div>
      )}

      {step.documents && step.documents.length > 0 && (
        <div className="max-w-[80%] ml-auto mt-2 p-4 rounded-lg bg-muted">
          <h4 className="text-sm font-medium mb-2">Attached Documents:</h4>
          <div className="space-y-2">
            {step.documents.map((doc) => (
              <Button
                key={doc.filename}
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={() => handleDownload(doc.taskId, doc.filename, doc.filename)}
              >
                <span className="truncate">{doc.filename}</span>
                <Download className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};