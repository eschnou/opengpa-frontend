import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { httpClient } from "@/lib/http-client";
import ReactMarkdown from 'react-markdown';

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  const { toast } = useToast();

  const handleDownload = async (taskId: string, documentId: string, filename: string) => {
    console.log("Downloading document:", documentId, "from task:", taskId);
    try {
      const response = await httpClient.get(`/api/tasks/${taskId}/documents/${documentId}`, {
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // Append to body, click, and clean up
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
      {/* Show user input if present */}
      {step.input && (
        <div className="max-w-[80%] p-4 rounded-lg bg-muted">
          {step.input}
        </div>
      )}

      {/* Handle output_message actions */}
      {step.action?.name === "output_message" ? (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground prose prose-invert">
          <ReactMarkdown>
            {step.action.parameters?.message || step.result?.details || ''}
          </ReactMarkdown>
        </div>
      ) : (
        /* For all other actions or no action, show the summary if available */
        step.result?.summary && (
          <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-muted text-muted-foreground">
            {step.result.summary}
          </div>
        )
      )}

      {/* Handle error messages */}
      {step.result?.error && (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-destructive text-destructive-foreground">
          {step.result.error}
        </div>
      )}

      {/* Display attached documents */}
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