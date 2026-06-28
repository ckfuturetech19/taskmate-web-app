import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { UpgradePromptDialog } from './UpgradePromptDialog';

interface UpgradePromptProps {
  feature?: string;
  description?: string;
  variant?: 'dialog' | 'inline' | 'page';
}

const UpgradePrompt = ({ 
  feature, 
  description,
  variant = 'inline' 
}: UpgradePromptProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${variant === 'page' ? 'py-12' : 'py-2'}`}>
      <div 
        className="glass rounded-2xl border border-primary/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg group hover:border-primary/40 transition-all duration-300"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">
              Premium Feature
            </p>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">
              {description || "Upgrade to TaskMate Pro to unlock editing and full synchronization."}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setIsDialogOpen(true)}
          size="sm"
          className="h-10 px-6 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #F0607A, #8B65C8)' }}
        >
          Upgrade to Pro
        </Button>
      </div>

      <UpgradePromptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={`Unlock ${feature || 'Premium features'}`}
        description={description || "You've selected a Pro feature. Upgrade to TaskMate Pro to enjoy unlimited access, real-time sync, and smart AI planner tools."}
      />
    </div>
  );
};

export default UpgradePrompt;

