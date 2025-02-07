
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

const ReferenceIndicator = ({ number, chunk }: { 
  number: number, 
  chunk: {
    documentId: string;
    documentTitle: string;
    documentDescription: string;
    content: string;
  }
}) => (
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

export const RagSearchRenderer = ({ step }: { step: TaskStepDTO }) => {
  if (!step.result?.details) return null;
  
  const details: RagSearchResult = step.result.details;
  
  // Create a map of chunk IDs to their index for reference numbering
  const chunkIndexMap = new Map(details.chunks.map((chunk, index) => [chunk.id, index + 1]));
  
  // Split content into paragraphs and their associated references
  const paragraphsWithRefs = details.content.split('\n\n').map(paragraph => {
    const refs: string[] = [];
    // Remove references from text and collect them
    const cleanText = paragraph.replace(
      /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]/g,
      (_, id) => {
        refs.push(id);
        return '';
      }
    );
    return {
      text: cleanText.trim(),
      references: refs.map(id => details.chunks.find(chunk => chunk.id === id)).filter(Boolean)
    };
  });

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="flex flex-col gap-4">
          {paragraphsWithRefs.map((paragraph, index) => (
            <div key={index} className="flex items-start gap-1">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="inline">
                      {children}
                      {paragraph.references.map((chunk, refIndex) => chunk && (
                        <ReferenceIndicator 
                          key={chunk.id} 
                          number={chunkIndexMap.get(chunk.id) || refIndex + 1} 
                          chunk={chunk}
                        />
                      ))}
                    </p>
                  ),
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {paragraph.text}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};
