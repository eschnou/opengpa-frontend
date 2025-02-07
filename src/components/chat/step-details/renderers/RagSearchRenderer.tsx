
import { TaskStepDTO } from "@/types/api";
import ReactMarkdown from 'react-markdown';
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RagSearchResult {
  content: string;
  chunks: {
    id: string;
    documentId: string;
    documentTitle: string;
    documentDescription: string;
    content: string;
  }[];
}

export const RagSearchRenderer = ({ step }: { step: TaskStepDTO }) => {
  if (!step.result?.details) return null;
  
  const details: RagSearchResult = step.result.details;
  
  // Create a map of chunk IDs to their index for reference numbering
  const chunkIndexMap = new Map(details.chunks.map((chunk, index) => [chunk.id, index + 1]));
  
  // Replace [uuid] references with numbered references
  const processedContent = details.content.replace(
    /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]/g,
    (_, uuid) => {
      const refNumber = chunkIndexMap.get(uuid);
      if (!refNumber) return `[${uuid}]`;
      
      const chunk = details.chunks.find(c => c.id === uuid);
      if (!chunk) return `[${uuid}]`;

      return `__REF_${refNumber}__`;
    }
  );

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-4">{children}</p>,
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
            text: ({ children }) => {
              if (typeof children !== 'string') return <>{children}</>;
              
              // Split by our custom reference markers
              const parts = children.split(/(\_\_REF\_\d+\_\_)/);
              
              return (
                <>
                  {parts.map((part, index) => {
                    const match = part.match(/\_\_REF\_(\d+)\_\_/);
                    if (!match) return part;
                    
                    const refNumber = parseInt(match[1]);
                    const chunk = details.chunks[refNumber - 1];
                    if (!chunk) return part;

                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center cursor-help">
                            <Circle 
                              className="h-4 w-4 inline-flex items-center justify-center fill-primary stroke-primary text-primary-foreground"
                              strokeWidth={0}
                            >
                              <text
                                x="8"
                                y="11"
                                className="text-[10px] font-medium fill-primary-foreground"
                              >
                                {refNumber}
                              </text>
                            </Circle>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <div className="space-y-2">
                            <p className="font-medium">{chunk.documentTitle}</p>
                            <p className="text-sm text-muted-foreground">{chunk.documentDescription}</p>
                            <p className="text-sm border-t pt-2 mt-2">{chunk.content}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </>
              );
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </TooltipProvider>
    </div>
  );
};

