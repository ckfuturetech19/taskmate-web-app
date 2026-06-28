import { ReactNode, useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { MobileAppBanner } from './MobileAppBanner';
import { MobileAppDialog } from './MobileAppDialog';
import { MobileBlockOverlay } from './MobileBlockOverlay';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  isZenMode?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.99,
    transition: { duration: 0.18, ease: [0.55, 0, 1, 0.45] }
  },
};

const AppLayout = ({ children, title, isZenMode }: AppLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    document.title = `${title} | TaskMate AI`;
  }, [title]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobileDevice(isMobileUA || isSmallScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
  };

  
  if (isMobileDevice) {
    return <MobileBlockOverlay />;
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-8%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.07] dark:opacity-[0.12] bg-[#FF3CAC]" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.06] dark:opacity-[0.10] bg-[#7B2FBE]" />
        <div className="absolute top-[40%] left-[35%] w-[30%] h-[30%] rounded-full blur-[120px] opacity-[0.03] dark:opacity-[0.06] bg-[#FF3CAC]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.04]" />
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
        "flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out relative z-10",
        isZenMode ? "ml-0" : (collapsed ? "md:ml-16" : "md:ml-[240px]")
      )}>
        {!isZenMode && (
          <AppHeader 
            title={title} 
            collapsed={collapsed}
            onMenuClick={handleMenuToggle} 
          />
        )}
        
        <main className={cn(
          "flex-1 pb-16 px-4 sm:px-6 lg:px-8",
          isZenMode ? "pt-0 px-0 sm:px-0 lg:px-0" : "pt-4"
        )}>
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
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
