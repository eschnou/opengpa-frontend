import { TaskStepDTO } from "@/types/api";

interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

export const SearchWebRenderer = ({ step }: { step: TaskStepDTO }) => {
  if (!Array.isArray(step.result?.details)) return null;
  
  return (
    <div className="space-y-6">
      {step.action?.reasoning && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Reasoning</h4>
          <div className="bg-muted rounded-lg p-4">
            {step.action.reasoning}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Search Results</h4>
        {step.result.details.map((result: SearchResult, index: number) => (
          <div key={index} className="mb-4 p-4 bg-muted rounded-lg">
            <a 
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium block mb-2"
            >
              {result.title}
            </a>
            <p className="text-sm text-muted-foreground">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};