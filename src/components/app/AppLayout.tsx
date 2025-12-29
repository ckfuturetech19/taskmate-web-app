import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { MobileAppBanner } from './MobileAppBanner';
import { MobileAppDialog } from './MobileAppDialog';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const handleMenuToggle = () => {
    console.log('handleMenuToggle called, current state:', mobileMenuOpen);
    setMobileMenuOpen(prev => {
      const newState = !prev;
      console.log('Setting mobileMenuOpen to:', newState);
      return newState;
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <MobileAppBanner />
      <MobileAppDialog isAuthenticated={!!user} />
      <AppSidebar 
        mobileMenuOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <AppHeader 
        title={title} 
        collapsed={collapsed}
        onMenuClick={handleMenuToggle} 
      />
      <main className={cn(
        "pt-16 min-h-screen transition-all duration-300 ease-in-out",
        // Mobile/Tablet: No left margin (sidebar is overlay)
        // Desktop: Adjust margin based on collapsed state
        collapsed ? "lg:ml-16" : "lg:ml-64",
        "ml-0"
      )} style={{ 
        transitionProperty: 'margin-left',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in-out'
      }}>
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
