import { TaskStepDTO } from "@/types/api";
import ReactMarkdown from 'react-markdown';
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
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center justify-center cursor-help ml-1 bg-[#333333] min-w-[1.5rem] h-6 px-1.5 rounded">
          <span className="text-[12px] font-semibold text-white">
            {number}
          </span>
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
  </TooltipProvider>
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
    ).trim();

    // Find the corresponding chunks for each reference
    const references = refs
      .map(id => details.chunks.find(chunk => chunk.id === id))
      .filter((chunk): chunk is NonNullable<typeof chunk> => chunk !== undefined);

    return { text: cleanText, references };
  }).filter(({ text }) => text.length > 0);

  return (
    <div className="space-y-4">
      {paragraphsWithRefs.map((paragraph, index) => (
        <div key={index} className="inline-flex items-baseline gap-1">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="inline">{children}</p>,
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {paragraph.text}
          </ReactMarkdown>
          {paragraph.references.map((chunk) => (
            <ReferenceIndicator 
              key={chunk.id} 
              number={chunkIndexMap.get(chunk.id) || 0}
              chunk={chunk}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
