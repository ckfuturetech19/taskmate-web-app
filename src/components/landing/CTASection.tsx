import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,hsla(207,81%,72%,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,hsla(208,67%,83%,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 sm:p-12 md:p-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">GET STARTED TODAY</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 sm:mb-6 px-4 leading-tight">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Productivity?</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4 leading-relaxed">
            Join thousands of users who are already managing their tasks smarter, not harder. Start your journey to peak productivity today.
          </p>
          
          <div className="flex flex-col gap-4 justify-center items-center px-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 px-8 sm:px-12 py-6 text-base sm:text-lg w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse-glow relative overflow-hidden group">
                <span className="relative z-10">Start Free Today</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-2">
              <span className="font-semibold text-foreground">✓ No credit card required</span> 
              <span>•</span>
              <span className="font-semibold text-foreground">✓ Free forever</span>
              <span>•</span>
              <span className="font-semibold text-foreground">✓ 2-minute setup</span>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 sm:mt-12 pt-8 border-t border-border/50">
            <div className="text-center px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group cursor-default">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">✓</div>
              <div className="text-xs sm:text-sm font-medium text-foreground mt-1">Instant Setup</div>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group cursor-default">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">✓</div>
              <div className="text-xs sm:text-sm font-medium text-foreground mt-1">Always Free</div>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group cursor-default">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">✓</div>
              <div className="text-xs sm:text-sm font-medium text-foreground mt-1">Cloud Sync</div>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group cursor-default">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">✓</div>
              <div className="text-xs sm:text-sm font-medium text-foreground mt-1">Secure & Private</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
