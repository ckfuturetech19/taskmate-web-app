import { useRef, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export const useCursorTracking = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Get mouse position relative to card center
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    // Calculate rotation angles (max 15 degrees)
    const rotateY = (mouseX / centerX) * 15;
    const rotateX = -(mouseY / centerY) * 15;

    setRotation({ x: rotateX, y: rotateY });

    // Calculate light position (0-100%)
    const lightX = ((e.clientX - rect.left) / rect.width) * 100;
    const lightY = ((e.clientY - rect.top) / rect.height) * 100;

    setLightPosition({ x: lightX, y: lightY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setLightPosition({ x: 50, y: 50 });
  };

  return {
    containerRef,
    rotation,
    lightPosition,
    handleMouseMove,
    handleMouseLeave,
  };
};
