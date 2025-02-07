
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { knowledgeService } from "@/services/knowledge.service";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: document, isLoading: isLoadingDocument } = useQuery({
    queryKey: ['document', id],
    queryFn: () => knowledgeService.getDocument(id as string)
  });

  const { data: chunks, isLoading: isLoadingChunks } = useQuery({
    queryKey: ['document-chunks', id],
    queryFn: () => knowledgeService.getDocumentChunks(id as string),
    enabled: !!id
  });

  const isLoading = isLoadingDocument || isLoadingChunks;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="container mx-auto py-8 px-4 mt-16">
          <div className="text-center">Document not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="container mx-auto py-8 px-4 mt-16">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/knowledge')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
          <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
          <div className="space-y-2 text-muted-foreground">
            <p>Filename: {document.filename}</p>
            <p>Description: {document.description}</p>
            <p>Content Type: {document.contentType}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Document Chunks</h2>
          <div className="space-y-2">
            {chunks?.map((chunk, index) => (
              <div
                key={chunk.id}
                className={`p-4 rounded-lg ${
                  index % 2 === 0 ? 'bg-muted' : 'bg-secondary'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{chunk.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;

