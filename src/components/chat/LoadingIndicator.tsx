import { Loader2 } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex items-center gap-2 p-4 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Processing your request...</span>
    </div>
  );
};