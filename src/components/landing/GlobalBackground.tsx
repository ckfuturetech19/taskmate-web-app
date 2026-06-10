import { useTheme } from "@/contexts/ThemeContext";

const GlobalBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Background color transitions */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 bg-[var(--aurora-bg-primary)]" 
      />

      {/* Aurora rotating blobs */}
      <div className="aurora-container absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-blob bg-[#8B65C8] top-[10%] left-[20%] opacity-[0.12] dark:opacity-[0.15]"></div>
        <div className="aurora-blob bg-[#4ABFB8] top-[50%] left-[80%] opacity-[0.08] dark:opacity-[0.10]" style={{ animationDelay: "-20s" }}></div>
        <div className="aurora-blob bg-[#F0607A] top-[80%] left-[30%] opacity-[0.08] dark:opacity-[0.10]" style={{ animationDelay: "-40s" }}></div>
        
        {/* Particles floating */}
        <div className="aurora-particle w-1 h-1 bg-[#8B65C8] top-[15%] left-[10%]"></div>
        <div className="aurora-particle w-1.5 h-1.5 bg-[#4ABFB8] top-[35%] left-[85%]" style={{ animationDelay: "-2s" }}></div>
        <div className="aurora-particle w-1 h-1 bg-[#F0607A] top-[65%] left-[40%]" style={{ animationDelay: "-5s" }}></div>
        <div className="aurora-particle w-2 h-2 bg-[#8B65C8] top-[80%] left-[15%]" style={{ animationDelay: "-8s" }}></div>
        <div className="aurora-particle w-1 h-1 bg-[#4ABFB8] top-[20%] left-[70%]" style={{ animationDelay: "-3s" }}></div>
      </div>

      {/* Grid Architecture */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          theme === 'dark' ? 'opacity-[0.04]' : 'opacity-[0.02]'
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(139, 101, 200, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(139, 101, 200, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
    </div>
  );
};

export default GlobalBackground;
