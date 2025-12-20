import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { MobileAppBanner } from './MobileAppBanner';
import { MobileAppDialog } from './MobileAppDialog';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <MobileAppBanner />
      <MobileAppDialog isAuthenticated={!!user} />
      <AppSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <AppHeader title={title} onMenuClick={() => setMobileMenuOpen(true)} />
      <main className="lg:ml-60 pt-14 sm:pt-16 min-h-screen transition-all duration-300">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
