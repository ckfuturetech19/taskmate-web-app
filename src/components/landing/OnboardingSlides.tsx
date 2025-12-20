import React, { useEffect, useState } from 'react';

const slides = [
  {
    image: '/assets/welcome.png',
    title: 'Welcome to TaskMate',
    description: 'Get started and organize your day effortlessly.'
  },
  {
    image: '/assets/task.png',
    title: 'Smart Task Management',
    description: 'Create, track, and complete tasks with ease.'
  },
  {
    image: '/assets/cloudsync.png',
    title: 'Cloud Sync',
    description: 'Access your tasks anywhere, anytime.'
  }
];


const AUTO_CHANGE_INTERVAL = 3500;


type OnboardingSlidesProps = {
  fullScreen?: boolean;
};

const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ fullScreen = false }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_CHANGE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex flex-col items-center justify-start gap-4 transition-all duration-500 ${fullScreen ? 'w-full h-full px-0 py-0' : 'w-[400px] h-[400px] px-8 py-12'}`}
      style={fullScreen ? { minHeight: '100%', minWidth: '100%' } : {}}
    >
      {/* Image on top, as big as possible */}
      <div className={fullScreen ? 'relative w-full h-[440px] flex items-center justify-center rounded-xl shadow-lg overflow-hidden mb-2 bg-gradient-to-br from-primary/10 to-secondary/10' : 'relative w-full h-[340px] flex items-center justify-center rounded-xl shadow-lg overflow-hidden mb-2 bg-gradient-to-br from-primary/10 to-secondary/10'}>
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">Image not found</span>
          </div>
        ) : (
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {/* Slide Title & Description below image */}
      <div className="w-full flex flex-col items-center mb-2">
        <div className="text-2xl font-bold text-primary text-center drop-shadow-sm mb-1">{slide.title}</div>
        <div className="text-base text-muted-foreground text-center max-w-[320px] mb-2">{slide.description}</div>
      </div>
      {/* ...removed fixed custom text section... */}
      {/* Slide indicators */}
      <div className="flex gap-2 mt-2 justify-center items-center w-full">
        {slides.map((_, idx) => (
          <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'} transition-all`}></span>
        ))}
      </div>
    </div>
  );
};

export default OnboardingSlides;
