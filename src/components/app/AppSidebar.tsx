import logoImg from '../../assets/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart3, Settings, ChevronLeft, ChevronRight, X, Shield, LogOut, Smartphone, Timer, Users, ExternalLink, Share2, Copy, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN';
const PRIVACY_POLICY_URL = 'https://chiragmali19.github.io/privacy-policy/';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', showBadge: true },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Users, label: 'Team', path: '/groups' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Timer, label: 'Focus Timer', path: '/clock' },
  { icon: Shield, label: 'Admin', path: '/admin', adminOnly: true },
];

const generalItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Shield, label: 'Privacy Policy', path: PRIVACY_POLICY_URL, external: true },
];

interface AppSidebarProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const AppSidebar = ({ mobileMenuOpen, onClose, collapsed: collapsedProp, setCollapsed: setCollapsedProp }: AppSidebarProps) => {
  const { unreadCount } = useNotifications();
  const { user, signOut } = useAuth();
  const { getPersonalTasks } = useTaskContext();
  const navigate = useNavigate();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('AppSidebar mobileMenuOpen state changed:', mobileMenuOpen);
  }, [mobileMenuOpen]);
  
  // Use prop if provided, otherwise use internal state
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;
  const setCollapsed = setCollapsedProp || setInternalCollapsed;
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Get actual task count
  const personalTasks = getPersonalTasks();
  const pendingTaskCount = personalTasks.filter(task => !task.isCompleted).length;

  // Minimum swipe distance (in px) to close drawer
  const minSwipeDistance = 50;

  // Track previous pathname to close menu only on actual route change
  const prevPathnameRef = useRef(location.pathname);
  
  // Close mobile menu on route change (mobile/tablet only)
  useEffect(() => {
    // Only close if pathname actually changed (not on initial mount)
    const pathnameChanged = prevPathnameRef.current !== location.pathname;
    if (pathnameChanged) {
      prevPathnameRef.current = location.pathname;
      // Only close on mobile/tablet when menu is open
      const isMobile = window.innerWidth < 1024;
      if (isMobile && mobileMenuOpen) {
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Only depend on pathname - don't include mobileMenuOpen to prevent immediate close bug
  }, [location.pathname]);

  // Handle touch events for swipe gesture
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    // Only handle swipe on mobile/tablet
    if (window.innerWidth < 1024 && isLeftSwipe && mobileMenuOpen) {
      onClose();
    }
  };

  const handleLogout = async () => {
    // Close mobile menu if open
    if (window.innerWidth < 1024) {
      onClose();
    }
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
        handleCopyLink();
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    try {
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
      toast({
        title: 'Copy failed',
        description: `Please copy this link manually: ${PLAY_STORE_URL}`,
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  // Navigation Item Component with Tooltip support
  const NavItem = ({ item, isActive, taskCount, isExternal = false }: { 
    item: (typeof menuItems[0] | typeof generalItems[0]) & { showBadge?: boolean }, 
    isActive: boolean, 
    taskCount?: number, 
    isExternal?: boolean 
  }) => {
    const content = (
      <div className={cn(
        "flex items-center relative text-sm transition-all duration-200 rounded-md",
        "hover:bg-accent/50",
        collapsed 
          ? "w-full justify-center py-2.5" 
          : "gap-3 px-3 py-2.5",
        !isActive && "text-muted-foreground"
      )}>
        {/* Active indicator - green vertical strip on left */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
        )}
        
        <div className={cn(
          "relative shrink-0 flex items-center justify-center",
          collapsed && "w-5 h-5"
        )}>
          <item.icon className={cn(
            "h-5 w-5",
            isActive ? "text-primary" : "text-muted-foreground"
          )} />
        </div>

        {!collapsed && (
          <>
            <span className={cn(
              "font-medium truncate flex-1 min-w-0",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
            {item.showBadge && taskCount !== undefined && taskCount > 0 && (
              <Badge 
                className="h-5 min-w-[24px] px-1.5 text-[10px] shrink-0 rounded-md"
                style={{ 
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'white'
                }}
              >
                {taskCount > 99 ? '99+' : taskCount > 9 ? `${taskCount}+` : taskCount}
              </Badge>
            )}
          </>
        )}
      </div>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              {isExternal ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <NavLink to={item.path} className="block">
                  {content}
                </NavLink>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              {item.label}
              {item.showBadge && taskCount !== undefined && taskCount > 0 && (
                <span className="ml-2">({taskCount})</span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return isExternal ? (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    ) : (
      <NavLink to={item.path} className="block">
        {content}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop - Only show on mobile/tablet when menu is open */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          role="button"
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-background border-r border-border/50 z-50",
          "transition-transform duration-300 ease-in-out",
          // Mobile/Tablet: Hidden by default (-translate-x-full), slide in when menu is open (translate-x-0)
          // Desktop: Always visible - lg:translate-x-0 overrides the mobile translate
          mobileMenuOpen 
            ? "translate-x-0" 
            : "-translate-x-full lg:translate-x-0",
          // Desktop: collapsible widths (only on lg and above)
          collapsed ? "lg:w-16" : "lg:w-64",
          // Mobile/Tablet widths (fixed when visible)
          "w-64 sm:w-72 md:w-80"
        )}
        style={{ 
          transitionProperty: 'width, transform',
          transitionDuration: '300ms',
          transitionTimingFunction: 'ease-in-out'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 lg:hidden h-8 w-8 z-50"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className={cn(
            "h-16 flex items-center border-b border-border transition-all duration-300 relative",
            collapsed ? "justify-center px-0 lg:justify-center" : "justify-between px-4"
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-10 w-10 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                  <img 
                    src={logoImg}
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
                <span className="font-bold text-foreground text-lg truncate">TaskMate</span>
              </div>
            )}
            
            {/* Toggle Button - Only visible on desktop (lg and above) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "h-8 w-8 hidden lg:flex shrink-0 transition-all duration-300",
                collapsed 
                  ? "absolute top-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full shadow-sm hover:bg-accent" 
                  : "hover:bg-accent"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            collapsed ? "py-3 px-0 lg:py-3 lg:px-0" : "py-3 px-2 lg:py-3 lg:px-2"
          )}>
            <div className="space-y-6">
              {/* MENU Section */}
              <div>
                {!collapsed && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    MENU
                  </p>
                )}
                <div className="space-y-0.5">
                  {menuItems
                    .filter(item => !item.adminOnly || (user && user.isAdmin))
                    .map((item) => {
                    const taskCount = item.path === '/tasks' ? pendingTaskCount : 0;
                    const isActive = location.pathname === item.path || 
                      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    
                    const handleNavClick = () => {
                      // Close mobile menu when navigating (mobile/tablet only)
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    };

                    return (
                      <div key={item.path} onClick={handleNavClick}>
                        <NavItem
                          item={item}
                          isActive={isActive}
                          taskCount={taskCount}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GENERAL Section */}
              <div>
                {!collapsed && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    GENERAL
                  </p>
                )}
                <div className="space-y-0.5">
                  {generalItems.map((item) => {
                    const isActive = !item.external && location.pathname === item.path;
                    
                    const handleNavClick = () => {
                      // Close mobile menu when navigating (mobile/tablet only)
                      if (window.innerWidth < 1024 && !item.external) {
                        onClose();
                      }
                    };

                    return (
                      <div key={item.path} onClick={handleNavClick}>
                        <NavItem
                          item={item}
                          isActive={isActive}
                          isExternal={item.external}
                        />
                      </div>
                    );
                  })}
                  
                  {/* Logout Button */}
                  {collapsed ? (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 rounded-md"
                          >
                            <LogOut className="h-5 w-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                          Logout
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 rounded-md"
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                      <span className="font-medium">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile App Download Card - Only show when expanded */}
          {!collapsed && (
            <div className="p-4 border-t border-border">
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
        </div>

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
      </aside>
    </>
  );
};

export default AppSidebar;
