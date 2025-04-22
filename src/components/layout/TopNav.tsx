
import { Settings, FileText, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { APP_CONFIG } from "@/config/app.config";
import { useIsMobile } from "@/hooks/use-mobile";
import { AgentMenu } from "@/components/AgentMenu";

export const TopNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    console.log("Logging out user...");
    authService.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/login");
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 h-16 px-4 flex items-center justify-between z-50">
      {/* Left section: Logo and App Name */}
      <div className="flex items-center gap-2 min-w-0">
        <img 
          src={APP_CONFIG.branding.navbarLogo} 
          alt={`${APP_CONFIG.branding.appName} Logo`} 
          className="h-8 w-8"
        />
        {!isMobile && (
          <span className="font-semibold text-lg text-primary truncate">
            {APP_CONFIG.branding.appName}
          </span>
        )}
      </div>
      {/* Center section: AgentMenu centered absolutely */}
      <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 flex items-center justify-center pointer-events-none w-fit z-0">
        <div className="pointer-events-auto">
          <AgentMenu />
        </div>
      </div>
      {/* Right section: Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/knowledge')}>
          <FileText className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};
