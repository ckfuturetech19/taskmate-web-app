import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart3, Bell, Settings, ChevronLeft, ChevronRight, Menu, X, HelpCircle, LogOut, Smartphone, Timer, Users, ExternalLink, Share2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', showBadge: true },
  { icon: Users, label: 'Team', path: '/groups' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Timer, label: 'Focus Timer', path: '/clock' },
];

const generalItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

interface AppSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AppSidebar = ({ mobileMenuOpen, setMobileMenuOpen }: AppSidebarProps) => {
  const { unreadCount } = useNotifications();
  const { signOut } = useAuth();
  const { getPersonalTasks } = useTaskContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Get actual task count
  const personalTasks = getPersonalTasks();
  const pendingTaskCount = personalTasks.filter(task => !task.isCompleted).length;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleOpenApp = () => {
    window.open(PLAY_STORE_URL, '_blank');
    setShowDownloadDialog(false);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'TaskMate - Task Management App',
      text: 'Check out TaskMate - A powerful task management app!',
      url: PLAY_STORE_URL,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShowDownloadDialog(false);
      } else {
        // Fallback to copy if share is not available
        handleCopyLink();
      }
    } catch (error: any) {
      // User cancelled or error occurred, fallback to copy
      if (error.name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PLAY_STORE_URL);
        setCopied(true);
        toast({
          title: 'Link copied!',
          description: 'Play Store link has been copied to clipboard.',
        });
        setTimeout(() => {
          setCopied(false);
          setShowDownloadDialog(false);
        }, 1500);
        return;
      }

      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = PLAY_STORE_URL;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          toast({
            title: 'Link copied!',
            description: 'Play Store link has been copied to clipboard.',
          });
          setTimeout(() => {
            setCopied(false);
            setShowDownloadDialog(false);
          }, 1500);
        } else {
          throw new Error('Copy command failed');
        }
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (error) {
      // If all methods fail, show the link in a way user can manually copy
      toast({
        title: 'Copy failed',
        description: `Please copy this link manually: ${PLAY_STORE_URL}`,
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-background border-r border-border/50 transition-all duration-300 z-40",
          // Desktop: always visible, collapsible
          "lg:block",
          collapsed ? "lg:w-16" : "lg:w-60",
          // Mobile: slide in from left
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-64 sm:w-72 md:w-80 lg:w-60"
        )}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 lg:hidden h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      <div className="flex flex-col h-full bg-background">
        <div className={cn(
          "h-14 sm:h-16 flex items-center border-b border-border px-3 sm:px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-10 w-10 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                <img 
                  src="/assets/logo.png" 
                  alt="TaskMate Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-primary font-bold text-sm';
                      fallback.textContent = 'T';
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <span className="font-bold text-foreground text-base sm:text-lg truncate">TaskMate</span>
            </div>
          )}
          {collapsed && (
            <div className="h-10 w-10 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
              <img 
                src="/assets/images/logo.png" 
                alt="TaskMate Logo" 
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const fallback = document.createElement('span');
                    fallback.className = 'text-primary font-bold text-sm';
                    fallback.textContent = 'T';
                    target.parentElement.appendChild(fallback);
                  }
                }}
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-8 w-8 hidden lg:flex", collapsed && "absolute -right-4 bg-card border border-border rounded-full")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-3 sm:p-4 space-y-6 overflow-y-auto">
          {/* MENU Section */}
          <div>
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                MENU
              </p>
            )}
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const taskCount = item.path === '/tasks' ? pendingTaskCount : 0;
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 relative text-sm group",
                      "hover:bg-accent/50",
                      collapsed && "justify-center",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {/* Active indicator - green vertical strip on left */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                    )}
                    <div className={cn(
                      "relative shrink-0 flex items-center",
                      isActive && "text-primary"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className={cn(
                          "font-medium truncate",
                          isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}>
                          {item.label}
                        </span>
                        {item.showBadge && item.path === '/tasks' && taskCount > 0 && (
                          <Badge 
                            className="h-5 min-w-[24px] px-1.5 text-[10px] shrink-0 ml-2 rounded-md"
                            style={{ 
                              backgroundColor: 'hsl(var(--primary))',
                              color: 'white'
                            }}
                          >
                            {taskCount > 99 ? '99+' : taskCount > 9 ? `${taskCount}+` : taskCount}
                          </Badge>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* GENERAL Section */}
          <div>
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                GENERAL
              </p>
            )}
            <div className="space-y-0.5">
              {generalItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-sm relative",
                      "hover:bg-accent/50",
                      collapsed && "justify-center",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                    )}
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {!collapsed && (
                      <span className={cn(
                        "font-medium truncate",
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground relative",
                  collapsed && "justify-center"
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile App Download Card */}
        {!collapsed && (
          <div className="p-3 sm:p-4 border-t border-border">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Smartphone className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">Download our Mobile App</h3>
                    <p className="text-xs text-primary-foreground/80">Get easy in another way</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  onClick={() => setShowDownloadDialog(true)}
                >
                  Download
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Download App Dialog */}
        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle>Download TaskMate App</DialogTitle>
              </div>
              <DialogDescription className="text-base pt-2">
                Get the TaskMate mobile app from Google Play Store for a better experience on the go.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-3 py-4">
              <Button
                onClick={handleOpenApp}
                className="w-full justify-start gap-3 h-auto py-3"
                style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
              >
                <ExternalLink className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">Open in Play Store</div>
                  <div className="text-xs opacity-90">Open the app page directly</div>
                </div>
              </Button>

              <Button
                onClick={handleShareApp}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-primary/30 hover:bg-primary/10"
              >
                <Share2 className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">Share Link</div>
                  <div className="text-xs text-muted-foreground">Share via your device's share menu</div>
                </div>
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-primary/30 hover:bg-primary/10"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-primary" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-primary">Link Copied!</div>
                      <div className="text-xs text-muted-foreground">Link copied to clipboard</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Copy Link</div>
                      <div className="text-xs text-muted-foreground">Copy Play Store link to clipboard</div>
                    </div>
                  </>
                )}
              </Button>

              {/* Manual copy option - show link in selectable text */}
              <div className="mt-2 p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">Or copy manually:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={PLAY_STORE_URL}
                    className="flex-1 px-2 py-1.5 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const input = document.querySelector('input[value*="play.google.com"]') as HTMLInputElement;
                      if (input) {
                        input.select();
                        input.setSelectionRange(0, 99999);
                      }
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDownloadDialog(false);
                  setCopied(false);
                }}
                className="text-sm"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
    </>
  );
};

export default AppSidebar;
