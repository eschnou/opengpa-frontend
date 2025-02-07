import { TaskStepDTO } from "@/types/api";
import ReactMarkdown from 'react-markdown';

export const DefaultRenderer = ({ step }: { step: TaskStepDTO }) => {
  return (
    <div>
      {step.action?.reasoning && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Reasoning</h4>
          <div className="bg-muted rounded-lg p-4 text-foreground">
            {step.action.reasoning}
          </div>
        </div>
      )}

      {step.result?.details && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Details</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="prose dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/90" />
                  ),
                }}
              >
                {typeof step.result.details === 'string' 
                  ? step.result.details 
                  : JSON.stringify(step.result.details, null, 2)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};