
import { Loader2, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LoadingIndicatorProps {
  stopping?: boolean;
  uploading?: boolean;
  progress?: number;
}

export const LoadingIndicator = ({ stopping = false, uploading = false, progress = 0 }: LoadingIndicatorProps) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4 rounded-lg bg-muted/50">
      {uploading ? (
        <>
          <div className="flex flex-col w-full gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uploading files...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {stopping ? (
              <CircleOff className="h-5 w-5 text-destructive animate-pulse" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            <span className="text-sm text-muted-foreground">
              {stopping ? "Stopping..." : "Processing..."}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
