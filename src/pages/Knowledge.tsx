
import { useQuery } from "@tanstack/react-query";
import { knowledgeService } from "@/services/knowledge.service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye, File, Trash, Upload, FilePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/layout/TopNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { RagDocumentDTO } from "@/types/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Knowledge = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<RagDocumentDTO | null>(null);

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: knowledgeService.listDocuments,
    refetchInterval: (query) => {
      if (Array.isArray(query.state.data) && query.state.data.some(doc => doc.progress < 1)) {
        return 2000;
      }
      return false;
    }
  });

  const handleDelete = async (document: RagDocumentDTO) => {
    setDocumentToDelete(document);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await knowledgeService.deleteDocument(documentToDelete.id);
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    try {
      await knowledgeService.uploadDocument(title, description, file);
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded and is being processed",
      });
      refetch();
      setIsUploading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

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

  const UploadDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        {documents?.length === 0 ? (
          <Button size="lg" className="w-full py-8">
            <FilePlus className="h-6 w-6 mr-2" />
            Upload your first document
          </Button>
        ) : (
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input id="file" name="file" type="file" required />
          </div>
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="container mx-auto py-8 px-4 mt-16">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          {documents?.length > 0 && <UploadDialog />}
        </div>
        <p className="text-muted-foreground mb-6">
          These documents are automatically analyzed and made available to the AI agent. When working on tasks, 
          the agent will intelligently reference this knowledge to provide more accurate and contextual responses.
        </p>
        <div className="space-y-4">
          {documents?.map((doc) => (
            <div key={doc.id} className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.filename}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.progress === 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/knowledge/${doc.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {doc.progress < 1 && (
                <div className="flex items-center gap-2">
                  <Progress value={doc.progress * 100} className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    {Math.round(doc.progress * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
          {documents?.length === 0 && (
            <div className="text-center">
              <div className="py-8">
                <UploadDialog />
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(isOpen) => !isOpen && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to delete <span className="font-medium">{documentToDelete?.filename}</span>.
              </p>
              <p className="text-destructive">
                This action cannot be undone. The document and all its associated data will be permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Knowledge;
