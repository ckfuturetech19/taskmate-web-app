import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const CTASection = () => {
  const { theme } = useTheme();
  const dashboardImage = theme === 'dark' 
    ? '../../assets/images/dashboardDark.png' 
    : '../../assets/images/dashboardLight.png';

  return (
    <section className="py-16 md:py-24 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Take the first step towards effortless productivity
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            TaskMate is the ultimate task management solution designed for startups and growing teams.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
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
    </section>
  );
};

export default CTASection;
