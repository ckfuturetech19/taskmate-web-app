import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'has_dismissed_mobile_app_banner';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.taskmate.app'; // Update with actual URL

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if banner was dismissed
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (isMobile && !wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg
              className="w-8 h-8 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Get the TaskMate App</div>
              <div className="text-xs opacity-90 truncate">
                Faster access, notifications, and offline support
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Download
            </a>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
