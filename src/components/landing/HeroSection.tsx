import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3"></div>
      
      {/* Minimal floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
          Stay Organized.<br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">Be Productive.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Manage tasks effortlessly. Collaborate with your team. Achieve your goals faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/auth" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 px-8 py-6 text-base w-full sm:w-auto shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a 
            href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base w-full sm:w-auto hover:bg-accent/50 transition-all duration-300 group">
              <Zap className="h-4 w-4 text-primary group-hover:text-yellow-500 transition-colors" />
              <span>Download App</span>
            </Button>
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>2min Setup</span>
          </div>
        </div>

        {/* Stats Section - Minimal Design */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 sm:mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center group cursor-default">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">1K+</div>
            <div className="text-xs text-muted-foreground">Installs</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">10K+</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
          <a 
            href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-center group cursor-pointer"
          >
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 flex items-center gap-1 group-hover:text-primary transition-colors">
              <span>5.0</span>
              <span className="text-yellow-500">★</span>
            </div>
            <div className="text-xs text-muted-foreground">30+ Reviews</div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
