
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Knowledge from "./pages/Knowledge";
import DocumentDetails from "./pages/DocumentDetails";
import { isAuthenticated } from "@/utils/token";
import { useEffect } from "react";
import { applyThemeColors } from "@/utils/theme";
import { APP_CONFIG } from "@/config/app.config";
import { AgentProvider } from "@/contexts/AgentContext";
import { AgentMenu } from "@/components/AgentMenu";
import TopNav from "@/components/layout/TopNav"; // <-- Fix: import TopNav

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  // Apply theme colors when the app initializes
  useEffect(() => {
    applyThemeColors();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme={APP_CONFIG.defaultTheme} enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AgentProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col h-screen">
                        <div className="flex-none flex items-center h-16 px-2 border-b bg-background z-30">
                          <AgentMenu />
                          <div className="flex-1">
                            <TopNav />
                          </div>
                        </div>
                        <Index />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/knowledge"
                  element={
                    <ProtectedRoute>
                      <Knowledge />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/knowledge/:id"
                  element={
                    <ProtectedRoute>
                      <DocumentDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AgentProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

