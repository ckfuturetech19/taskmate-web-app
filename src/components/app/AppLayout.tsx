import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { MobileAppBanner } from './MobileAppBanner';
import { MobileAppDialog } from './MobileAppDialog';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  isZenMode?: boolean;
}

const AppLayout = ({ children, title, isZenMode }: AppLayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const handleMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.15]" />
      </div>

      <MobileAppBanner />
      <MobileAppDialog isAuthenticated={!!user} />
      
      {!isZenMode && (
        <AppSidebar 
          mobileMenuOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-500 ease-in-out relative z-10",
        isZenMode ? "ml-0" : (collapsed ? "md:ml-20" : "md:ml-72"),
        "ml-0"
      )}>
        {!isZenMode && (
          <AppHeader 
            title={title} 
            collapsed={collapsed}
            onMenuClick={handleMenuToggle} 
          />
        )}
        
        <main className={cn(
          "flex-1 pb-12 px-4 sm:px-6 lg:px-8",
          isZenMode ? "pt-0 px-0 sm:px-0 lg:px-0" : "pt-20"
        )}>
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

