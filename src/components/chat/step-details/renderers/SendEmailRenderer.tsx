import { TaskStepDTO } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export const SendEmailRenderer = ({ step }: { step: TaskStepDTO }) => {
  const emailDetails = step.result?.details;
  
  if (!emailDetails) {
    return <div>No email details available</div>;
  }

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

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <CardTitle className="text-lg">Email Sent</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">To:</div>
            <div className="text-sm font-medium">{emailDetails.recipient}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Subject:</div>
            <div className="text-sm font-medium">{emailDetails.title}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Message:</div>
            <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
              {emailDetails.body}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};