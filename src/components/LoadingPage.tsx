import logoImg from '../assets/logo.png';
import { useEffect, useState } from 'react';

const LoadingPage = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-50 animate-pulse-glow"></div>
          <div className="relative bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-2xl">
            <img 
              src={logoImg}
              alt="TaskMate Logo" 
              className="h-20 w-20 sm:h-24 sm:w-24 animate-bounce-subtle"
            />
          </div>
        </div>

        {/* App name with gradient */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TaskMate
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base flex items-center justify-center gap-1">
            Loading your tasks
            <span className="inline-block w-12 text-left">{dots}</span>
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 sm:w-64 h-2 bg-border/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-gradient rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
