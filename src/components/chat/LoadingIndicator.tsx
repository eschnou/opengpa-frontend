import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  stopping?: boolean;
}

export const LoadingIndicator = ({ stopping = false }: LoadingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 p-4 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">
        {stopping ? "Stopping request..." : "Processing your request..."}
      </span>
    </div>
  );
};