
import { DocumentDTO } from "@/types/api";
import { FileText, Image, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentAttachmentProps {
  document: DocumentDTO;
}

export const DocumentAttachment = ({ document }: DocumentAttachmentProps) => {
  const fileExtension = document.filename.split('.').pop()?.toLowerCase();
  
  // Function to determine icon based on file extension
  const getIcon = () => {
    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      return <Image className="h-4 w-4" />;
    } else if (fileExtension === 'csv') {
      return <FileSpreadsheet className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-md bg-muted/50"
    )}>
      {getIcon()}
      <span className="text-sm truncate">{document.filename}</span>
    </div>
  );
};
