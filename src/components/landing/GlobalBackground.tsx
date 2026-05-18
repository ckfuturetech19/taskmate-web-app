import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const GlobalBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Optimized Base Background */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-1000",
        theme === 'dark' ? "bg-[#030712]" : "bg-[#f8fafc]"
      )} />

      {/* Lightweight Mesh Gradients - Performance Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
          theme === 'dark' ? "bg-primary" : "bg-primary/40"
        )} />
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
          theme === 'dark' ? "bg-secondary" : "bg-secondary/40"
        )} />
      </div>
      
      {/* Subtle Grid Pattern - Very Lightweight */}
      <div className={cn(
        "absolute inset-0 opacity-[0.03]",
        theme === 'dark' 
          ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)]",
        "bg-[size:40px_40px]"
      )} />

      {/* Noise Texture - CSS only */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default GlobalBackground;
