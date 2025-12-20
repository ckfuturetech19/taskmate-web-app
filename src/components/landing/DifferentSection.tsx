import { Card, CardContent } from '@/components/ui/card';
import { Activity, Target, TrendingUp } from 'lucide-react';

const DifferentSection = () => {
  const features = [
    {
      icon: Activity,
      title: 'Activity tracking & insights',
      description: 'Monitor your productivity with detailed analytics and real-time activity tracking.',
      image: 'activity'
    },
    {
      icon: Target,
      title: 'Task prioritization',
      description: 'Focus on what matters most with intelligent task prioritization and organization.',
      image: 'priority'
    },
    {
      icon: TrendingUp,
      title: 'Data driven insights',
      description: 'Make informed decisions with comprehensive data analytics and performance metrics.',
      image: 'insights'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What makes us different?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Simplify project planning, Streamline collaboration, and boost productivity all with TaskMate task management solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-xl transition-all duration-300 border-border/50"
            >
              <CardContent className="p-6 md:p-8">
                {/* Feature Preview Card */}
                <div className="mb-6 rounded-lg bg-muted/50 p-4 h-48 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <div className="text-sm font-medium text-foreground">{feature.title}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentSection;

