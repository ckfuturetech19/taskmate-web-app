import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const CustomCursor = () => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-smooth following springs for the trailing ring
  const trailingX = useSpring(mouseX, { stiffness: 180, damping: 30 });
  const trailingY = useSpring(mouseY, { stiffness: 180, damping: 30 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden md:block">
      {/* Trailing Ring (System cursor remains visible) */}
      <motion.div
        style={{
          left: trailingX,
          top: trailingY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.6 : 1,
          borderColor: isHovering 
            ? '#F0607A' 
            : theme === 'dark' ? 'rgba(139, 101, 200, 0.4)' : 'rgba(139, 101, 200, 0.3)',
          backgroundColor: isHovering 
            ? 'rgba(240, 96, 122, 0.05)' 
            : 'rgba(139, 101, 200, 0)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute w-6 h-6 rounded-full border border-primary/30"
      />
    </div>
  );
};

export default CustomCursor;
