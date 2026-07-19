import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

const STORAGE_KEY = 'has_seen_mobile_app_dialog';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN'; // Update with actual URL

interface MobileAppDialogProps {
  isAuthenticated: boolean;
}

export function MobileAppDialog({ isAuthenticated }: MobileAppDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check if desktop device
    const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if dialog was shown before
    const hasSeenDialog = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (isDesktop && !hasSeenDialog) {
      // Show dialog after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle>TaskMate Apps Available</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Manage your tasks seamlessly on any device with native apps for Android and Windows.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-2 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Real-time synchronization across web, mobile, & desktop</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Native desktop tray and background notifications</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Offline support and automatic sync</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:flex-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              window.open('https://downloads.taskmateapp.site/TaskMate%20Setup%201.0.0.exe', '_blank');
              setIsOpen(false);
            }}
            className="w-full sm:flex-1 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] hover:opacity-90 text-white"
          >
            💻 Windows App
          </Button>
          <Button
            onClick={() => {
              window.open(PLAY_STORE_URL, '_blank');
              setIsOpen(false);
            }}
            className="w-full sm:flex-1"
          >
            🤖 Android App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
