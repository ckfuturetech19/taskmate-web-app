import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const CustomCursor = () => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-smooth following springs
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const trailingX = useSpring(mouseX, { stiffness: 200, damping: 40 });
  const trailingY = useSpring(mouseY, { stiffness: 200, damping: 40 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Hide system cursor on mount
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        (target as any).onclick
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      // Show system cursor on unmount
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden md:block">
      {/* Outer Ring */}
      <motion.div
        style={{
          left: trailingX,
          top: trailingY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          borderColor: theme === 'dark' ? 'rgba(34,211,238,0.5)' : 'rgba(14,165,233,0.8)',
        }}
        className="absolute w-8 h-8 rounded-full border border-primary/40"
      />

      {/* Main Core Dot */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          backgroundColor: theme === 'dark' ? '#22d3ee' : '#0ea5e9',
        }}
        className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.4)]"
      />
    </div>
  );
};

export default CustomCursor;
