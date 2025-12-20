import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { initializeServiceWorkerHandler } from "@/lib/serviceWorkerHandler";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Clock from "./pages/Clock";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  // Initialize service worker handler on mount
  useEffect(() => {
    initializeServiceWorkerHandler();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <NotificationProvider>
            <TaskProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute><Tasks /></ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute><Analytics /></ProtectedRoute>
                } />
                <Route path="/groups" element={
                  <ProtectedRoute><Groups /></ProtectedRoute>
                } />
                <Route path="/groups/:groupId" element={
                  <ProtectedRoute><GroupDetail /></ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute><Notifications /></ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute><Settings /></ProtectedRoute>
                } />
                <Route path="/clock" element={
                  <ProtectedRoute><Clock /></ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
              </TooltipProvider>
            </TaskProvider>
          </NotificationProvider>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
