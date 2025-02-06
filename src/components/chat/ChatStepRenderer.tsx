import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Download, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { httpClient } from "@/lib/http-client";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  const { toast } = useToast();
  const [copiedBlockIndex, setCopiedBlockIndex] = useState<number | null>(null);

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

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlockIndex(index);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      });
      setTimeout(() => setCopiedBlockIndex(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  // Custom renderer for code blocks
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    const blockIndex = node.position?.start.line || 0;

    if (inline) {
      return <code className={className} {...props}>{children}</code>;
    }

    return (
      <pre className={`relative mt-4 rounded-lg bg-primary/10 border border-primary/20 ${className}`}>
        {language && (
          <div className="absolute top-0 left-0 px-3 py-1 text-sm text-primary bg-primary/20 rounded-br-lg">
            {language}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(codeString, blockIndex)}
            className="h-8 w-8 p-0 hover:bg-primary/20"
          >
            {copiedBlockIndex === blockIndex ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <code className="block p-4 pt-10 overflow-x-auto" {...props}>
          {children}
        </code>
      </pre>
    );
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
          <ReactMarkdown
            components={{
              code: CodeBlock
            }}
          >
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