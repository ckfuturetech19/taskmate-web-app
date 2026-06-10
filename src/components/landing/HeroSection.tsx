import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Play, Mic, Target } from 'lucide-react';
import dashboardDarkImg from '@/assets/dashboardDark.png';
import dashboardLightImg from '@/assets/dashboardLight.png';

const HeroSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dashboardImage = theme === 'dark' ? dashboardDarkImg : dashboardLightImg;

  return (
    <section className="min-h-[900px] flex items-center pt-32 pb-20 relative overflow-hidden bg-transparent">
      {/* Aurora Background Blobs */}
      <div className="aurora-container absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="aurora-blob bg-[#8B65C8] top-[10%] left-[20%] opacity-15"></div>
        <div className="aurora-blob bg-[#4ABFB8] top-[50%] left-[80%] opacity-10" style={{ animationDelay: '-20s' }}></div>
        <div className="aurora-blob bg-[#F0607A] top-[80%] left-[30%] opacity-10" style={{ animationDelay: '-40s' }}></div>
        
        {/* Floating Particles */}
        <div className="aurora-particle w-1 h-1 bg-[#8B65C8] top-[15%] left-[10%]"></div>
        <div className="aurora-particle w-1.5 h-1.5 bg-[#4ABFB8] top-[35%] left-[85%]" style={{ animationDelay: '-2s' }}></div>
        <div className="aurora-particle w-1 h-1 bg-[#F0607A] top-[65%] left-[40%]" style={{ animationDelay: '-5s' }}></div>
        <div className="aurora-particle w-2 h-2 bg-[#8B65C8] top-[80%] left-[15%]" style={{ animationDelay: '-8s' }}></div>
        <div className="aurora-particle w-1 h-1 bg-[#4ABFB8] top-[20%] left-[70%]" style={{ animationDelay: '-3s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#4ABFB8] animate-pulse shadow-[0_0_8px_#4ABFB8]"></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--aurora-text-secondary)]">AI-Powered Task Intelligence · v1.7.0</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tighter text-[var(--aurora-text-primary)]">
          Plan smarter.<br />
          <span className="bg-gradient-to-r from-[#F5A87B] via-[#F0607A] to-[#8B65C8] bg-clip-text text-transparent italic">Live better.</span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--aurora-text-secondary)] mb-10 leading-relaxed">
          Harness the power of AI to organize your life. From voice-captured thoughts to auto-scheduled days, TaskMate AI is your ultimate productivity partner.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white font-extrabold rounded-2xl shadow-[0_20px_40px_-10px_rgba(240,96,122,0.4)] hover:scale-105 active:scale-95 transition-all text-lg"
          >
            Get Started Free
          </button>
          <button 
            className="w-full sm:w-auto px-10 py-5 border border-white/10 bg-white/5 backdrop-blur-md font-extrabold rounded-2xl text-[var(--aurora-text-primary)] hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <Play className="w-5 h-5 fill-current" /> Watch Demo
          </button>
        </div>

        {/* Supported Platforms */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-20 opacity-70 text-[var(--aurora-text-secondary)]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <span className="text-xl text-[#4ABFB8]">🤖</span> Android Live
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
            <span className="text-xl">🍎</span> iOS Soon
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <span className="text-xl text-[#8B65C8]">🌐</span> Web App
          </div>
        </div>

        {/* 3D Mockup Container */}
        <div className="mockup-container max-w-5xl mx-auto px-4 perspective-[1500px]">
          <div className="mockup-inner relative rounded-3xl border border-white/10 bg-[var(--aurora-bg-secondary)] shadow-2xl p-2 transition-all duration-700 hover:rotate-0 hover:scale-[1.01] transform rotate-x-[6deg] rotate-y-[-4deg]">
            <div className="w-full bg-[#0b0e14] rounded-2xl overflow-hidden relative aspect-[16/10]">
              
              {/* Window Controls */}
              <div className="absolute top-4 left-6 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              
              {/* Dashboard Image */}
              <img 
                src={dashboardImage} 
                alt="TaskMate Dashboard" 
                className="w-full h-full object-cover opacity-90"
              />

              {/* Floating Widgets */}
              {/* Left Widget: Voice Capture */}
              <div className="absolute top-[15%] left-[-2%] z-30 aurora-floating-chip hidden lg:block">
                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#8B65C8] flex items-center justify-center text-white text-2xl shadow-lg">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B65C8]">Voice Capturing</p>
                    <p className="text-sm font-semibold text-white">"Schedule sync with devs..."</p>
                  </div>
                </div>
              </div>

              {/* Right Widget: Deep Work Focus */}
              <div className="absolute bottom-[20%] right-[-2%] z-30 aurora-floating-chip hidden lg:block" style={{ animationDelay: '-2s' }}>
                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#4ABFB8] flex items-center justify-center text-white text-2xl shadow-lg">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#4ABFB8]">Deep Work Active</p>
                    <p className="text-sm font-semibold text-white">Focus Timer: 42:15</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
