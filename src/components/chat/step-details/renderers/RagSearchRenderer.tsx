
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
  
  // Extract references and their content
  const references = details.chunks.map((chunk, index) => ({
    number: index + 1,
    chunk,
  }));

  // Replace [uuid] references with empty string to clean the text
  const cleanContent = details.content.replace(
    /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]/g,
    ''
  );

  const ReferenceIndicator = ({ number, chunk }: { number: number, chunk: typeof details.chunks[0] }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center cursor-help ml-1">
          <Circle 
            className="h-4 w-4 inline-flex items-center justify-center fill-primary stroke-primary text-primary-foreground"
            strokeWidth={0}
          >
            <text
              x="8"
              y="11"
              className="text-[10px] font-medium fill-primary-foreground"
            >
              {number}
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

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="flex flex-wrap items-start gap-1">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-4 inline-block">
                  {children}
                  {references.map((ref) => (
                    <ReferenceIndicator 
                      key={ref.chunk.id} 
                      number={ref.number} 
                      chunk={ref.chunk} 
                    />
                  ))}
                </p>
              ),
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {cleanContent}
          </ReactMarkdown>
        </div>
      </TooltipProvider>
    </div>
  );
};

