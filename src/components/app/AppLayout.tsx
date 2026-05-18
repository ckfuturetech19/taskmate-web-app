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
      {/* Optimized Background Elements - Lightweight and Static for Mobile/Low-end */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-[0.03]",
          "bg-primary"
        )} />
        <div className={cn(
          "absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-[0.03]",
          "bg-secondary"
        )} />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.05]" />
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
        isZenMode ? "ml-0" : (collapsed ? "md:ml-20" : "md:ml-72")
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

