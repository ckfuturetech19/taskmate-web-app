import { Button } from '@/components/ui/button';
import { Smartphone, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN';

export function MobileBlockOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0b0813] text-white flex flex-col items-center justify-between p-6 overflow-y-auto font-sans">
      {/* Decorative background grid and neon lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20 bg-[#FF3CAC]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20 bg-[#7B2FBE]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Header Logo */}
      <div className="w-full flex items-center justify-center pt-6 relative z-10">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Logo" className="h-8 w-8 rounded-lg shadow-[0_0_15px_rgba(255,60,172,0.3)]" />
          <span className="font-extrabold text-lg tracking-tighter">
            TASK<span className="text-[#FF3CAC]">MATE</span>
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center py-8 relative z-10 text-center">
        {/* Floating animated phone icon */}
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-[12px] bg-gradient-to-tr from-[#FF3CAC] to-[#7B2FBE] flex items-center justify-center shadow-[0_10px_30px_rgba(123,47,190,0.4)] animate-pulse">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 border-4 border-[#0b0813] flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
        </div>

        <h2 className="text-[24px] font-bold tracking-tight leading-tight mb-3">
          Get the Native App
        </h2>
        
        <p className="text-[14px] text-gray-400 leading-relaxed mb-8 px-4">
          TaskMate AI web is optimized for desktop workspaces. To continue managing tasks on mobile, download our native app for a seamless experience.
        </p>

        {/* Action Button stack */}
        <div className="w-full space-y-3 px-2">
          {/* Play Store Link */}
          <a 
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-xl flex items-center justify-between px-5 font-semibold text-[14px] transition-all bg-gradient-to-r from-[#FF3CAC] to-[#7B2FBE] text-white shadow-lg shadow-[#7B2FBE]/20 hover:brightness-110 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <Download className="h-4.5 w-4.5" />
              <span>Get it on Android</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </a>

          {/* iOS coming soon */}
          <div className="w-full h-12 rounded-xl flex items-center justify-between px-5 border border-white/10 bg-white/5 text-gray-300 select-none">
            <span className="text-[13px] font-medium">Download on iOS</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-gray-400">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center pb-6 relative z-10">
        <p className="text-[11px] text-gray-500">
          Syncs instantly with your desktop account
        </p>
      </div>
    </div>
  );
}
