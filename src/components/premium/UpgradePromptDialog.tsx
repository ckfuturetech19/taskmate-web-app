import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone, Sparkles, Star, Award, ChevronRight, Zap } from 'lucide-react';

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN';

export const UpgradePromptDialog: React.FC<UpgradePromptDialogProps> = ({
  open,
  onOpenChange,
  title = "Unlock Full Potential",
  description = "You've reached the limit of free usage. Upgrade to Pro to get unlimited access and download the mobile app to sync on the go."
}) => {
  const handleUpgrade = () => {
    window.open(PLAY_STORE_URL, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] overflow-hidden bg-card/95 border border-primary/20 shadow-2xl backdrop-blur-xl rounded-2xl p-0">
        
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative h-12 w-12 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center text-primary">
                  <Star className="h-6 w-6 animate-pulse" />
                </div>
              </div>
            </div>
            
            <DialogTitle className="text-center text-2xl font-black tracking-tight text-foreground">
              {title}
            </DialogTitle>
            
            <DialogDescription className="text-center text-sm text-muted-foreground font-medium px-2 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Premium Benefits Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <Award className="h-5 w-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Unlimited Life Milestones & Notes</p>
                <p className="text-[10px] text-muted-foreground">Free plan limits creation to 1 milestone and 2 notes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
              <Smartphone className="h-5 w-5 text-secondary shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Real-time Mobile Sync & Push Alerts</p>
                <p className="text-[10px] text-muted-foreground">Keep your life and projects organized anywhere, offline or online.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
              <Sparkles className="h-5 w-5 text-accent shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Advanced AI Assistant Features</p>
                <p className="text-[10px] text-muted-foreground">Generate recurring templates, get analytics and smart task enhancements.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleUpgrade}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Get Pro & Download App <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-10 rounded-xl font-bold text-xs text-muted-foreground hover:bg-muted"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="bg-muted/40 p-4 border-t border-border/50 text-center flex items-center justify-center gap-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            TaskMate Premium Edition
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
