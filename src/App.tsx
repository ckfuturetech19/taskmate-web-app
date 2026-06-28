import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import AnalyticsProvider from "@/contexts/AnalyticsContext";
import { initializeServiceWorkerHandler } from "@/lib/serviceWorkerHandler";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalBackground from "@/components/landing/GlobalBackground";
import CustomCursor from "@/components/landing/CustomCursor";
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
import AdminUsers from "./pages/AdminUsers";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import Milestones from "./pages/Milestones";
import MilestoneDetail from "./pages/MilestoneDetail";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import ProjectListPage from "./pages/ProjectListPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import TeamTaskListPage from "./pages/TeamTaskListPage";
import { TaskDetailsPage } from "./pages/TaskDetailsPage";
import WorkspaceSettingsPage from "./pages/WorkspaceSettingsPage";
import WorkspaceDashboardPage from "./pages/WorkspaceDashboardPage";
import { WorkspaceNotifications } from "./modules/notifications/WorkspaceNotifications";
import { WorkspaceInvitations } from "./modules/notifications/WorkspaceInvitations";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

// Wrapper component to handle location-based visibility
const AppContent = () => {
  const location = useLocation();
  const isLandingOrAuth = 
    location.pathname === '/' || 
    location.pathname === '/auth' || 
    location.pathname === '/contact' ||
    location.pathname === '/privacy' ||
    location.pathname === '/terms' ||
    location.pathname === '/about';

  return (
    <>
      {isLandingOrAuth && <GlobalBackground />}
      {isLandingOrAuth && <CustomCursor />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/admin" element={
            <ProtectedRoute><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute><Notes /></ProtectedRoute>
          } />
          <Route path="/notes/:noteId" element={
            <ProtectedRoute><NoteDetail /></ProtectedRoute>
          } />
          <Route path="/milestones" element={
            <ProtectedRoute><Milestones /></ProtectedRoute>
          } />
          <Route path="/milestones/:id" element={
            <ProtectedRoute><MilestoneDetail /></ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute><ProjectListPage /></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>
          } />
          <Route path="/team-tasks" element={
            <ProtectedRoute><TeamTaskListPage /></ProtectedRoute>
          } />
          <Route path="/team-tasks/:id" element={
            <ProtectedRoute><TaskDetailsPage /></ProtectedRoute>
          } />
          <Route path="/workspace-settings" element={
            <ProtectedRoute><WorkspaceSettingsPage /></ProtectedRoute>
          } />
          <Route path="/workspace/dashboard" element={
            <ProtectedRoute><WorkspaceDashboardPage /></ProtectedRoute>
          } />
          <Route path="/reminders" element={
            <ProtectedRoute><WorkspaceNotifications /></ProtectedRoute>
          } />
          <Route path="/invitations" element={
            <ProtectedRoute><WorkspaceInvitations /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  // Initialize service worker handler on mount
  useEffect(() => {
    initializeServiceWorkerHandler();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <PremiumProvider>
            <NotificationProvider>
              <TaskProvider>
              <AnalyticsProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </TooltipProvider>
              </AnalyticsProvider>
            </TaskProvider>
          </NotificationProvider>
        </PremiumProvider>
      </WorkspaceProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
