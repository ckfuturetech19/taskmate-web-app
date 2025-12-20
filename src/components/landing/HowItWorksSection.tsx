import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Users, Zap } from 'lucide-react';

const steps = [
  {
    icon: CheckSquare,
    title: 'Create Tasks',
    description: 'Start by creating tasks and organizing them into projects. Set priorities, due dates, and assign them to team members.'
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Invite your team members, create groups, and work together in real-time. Share files and communicate seamlessly.'
  },
  {
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Track your progress with analytics, get insights, and optimize your workflow to achieve more in less time.'
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with TaskMate in three simple steps and transform your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <Card 
              key={step.title}
              className="group hover:shadow-xl transition-all duration-300 border-border/50"
            >
              <CardContent className="p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

