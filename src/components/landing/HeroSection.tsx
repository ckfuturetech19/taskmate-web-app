import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const HeroSection = () => {
  const { theme } = useTheme();
  const dashboardImage = theme === 'dark' 
    ? '../../assets/images/dashboardDark.png' 
    : '../../assets/images/dashboardLight.png';

  return (
    <section id="home" className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Trusted Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"></div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background"></div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 border-2 border-background"></div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">1K+ Installs</span>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            Boost Productivity with the{' '}
            <span className="text-primary">TaskMate</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Streamline your workflow, Manage Projects, and empower your team with TaskMate the all-in-one task management solution.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/auth">
            <Button size="lg" className="gap-2 px-8 py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <span>Book a demo</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base md:text-lg">
            Learn More
          </Button>
        </div>

        {/* Dashboard Screenshot */}
        <div className="mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img 
                src={dashboardImage}
                alt="TaskMate Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">1K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Installs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">10K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Tasks Done</div>
          </div>
          <a 
            href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-center group cursor-pointer"
          >
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-1 justify-center group-hover:text-primary transition-colors">
              <span>5.0</span>
              <span className="text-yellow-500">★</span>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">30+ Reviews</div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
