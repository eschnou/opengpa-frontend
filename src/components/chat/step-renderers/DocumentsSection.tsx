
import { DocumentDTO } from "@/types/api";
import { DocumentAttachment } from "./DocumentAttachment";

interface DocumentsSectionProps {
  documents: DocumentDTO[];
}

export const DocumentsSection = ({ documents }: DocumentsSectionProps) => {
  if (!documents || documents.length === 0) return null;
  
  return (
    <div className="max-w-[80%] ml-auto mt-2 p-4 rounded-lg bg-muted">
      <h4 className="text-sm font-medium mb-2">Attached Documents:</h4>
      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentAttachment key={doc.filename} document={doc} />
        ))}
      </div>
    </div>
  );
};
