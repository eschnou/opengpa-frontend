
import { TaskStepDTO } from "@/types/api";
import { MarkdownContent } from "../../step-renderers/MarkdownContent";

export const OutputMessageRenderer = ({ step }: { step: TaskStepDTO }) => {
  return (
    <div>
      {step.action?.reasoning && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Reasoning</h4>
          <div className="bg-muted rounded-lg p-4">
            {step.action.reasoning}
          </div>
        </div>
      )}
      
      {step.result?.details && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Details</h4>
          <div className="bg-muted rounded-lg p-4 prose prose-sm max-w-none dark:prose-invert">
            <MarkdownContent content={step.result.details} />
          </div>
        </div>
      )}
    </div>
  );
};
