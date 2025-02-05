import { Settings, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TopNav = () => {
  return (
    <nav className="glass fixed top-0 left-0 right-0 h-16 px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <img src="/lovable-uploads/f4f51fcf-0447-49c9-9d49-d57c4cd95d54.png" alt="OpenGPA Logo" className="h-8 w-8" />
        <span className="font-semibold text-lg text-primary">OpenGPA</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <FileText className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};