import { CheckSquare, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Tasks management',
    description: 'Create, organize, and track tasks with an intuitive interface designed for productivity.',
  },
  {
    icon: Users,
    title: 'Real-time collaboration',
    description: 'Work seamlessly with your team through real-time updates and instant notifications.',
  },
  {
    icon: Zap,
    title: 'Optimize performance',
    description: 'Boost your workflow efficiency with smart automation and performance insights.',
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful features to boost your workflow
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            TaskMate is innovative, can handle any type of job, and we never stop innovating.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-xl transition-all duration-300 border-border/50"
            >
              <CardContent className="p-6 md:p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all group/link"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
