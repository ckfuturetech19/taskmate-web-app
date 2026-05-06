import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import ParticlesBackground from "./ParticlesBackground";

const GlobalBackground = () => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <ParticlesBackground />
      

      {/* Global Mesh Architecture */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        theme === 'dark' 
          ? "bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_80%)] opacity-100" 
          : "bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_80%)] opacity-100"
      )} />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default GlobalBackground;
