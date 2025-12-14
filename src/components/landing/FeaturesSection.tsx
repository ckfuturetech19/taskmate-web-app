import { CheckSquare, Users, Calendar, Bell, Repeat, Target, Zap, Lock, Cloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Create, organize, and track tasks with intuitive interface, priorities, and custom categories.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Create groups, invite members, assign tasks, and collaborate seamlessly in real-time.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Advanced due date tracking with calendar integration and intelligent reminders.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Repeat,
    title: 'Recurring Tasks',
    description: 'Automate repetitive tasks with flexible daily, weekly, and custom recurring schedules.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance ensures smooth experience even with thousands of tasks.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get timely push notifications and never miss important tasks or deadlines.',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: Target,
    title: 'Priority System',
    description: 'Advanced priority management with visual indicators to focus on what matters.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with Firebase authentication and encrypted data storage.',
    color: 'from-gray-600 to-gray-800'
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Real-time synchronization across all your devices with Firebase cloud infrastructure.',
    color: 'from-sky-500 to-blue-500'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-background via-card/30 to-background relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 sm:mb-6 px-4">
            Everything You Need to Stay
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Productive & Organized</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            TaskMate combines powerful features with a beautiful, intuitive interface designed to keep you focused on what matters most.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in overflow-hidden cursor-default"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardContent className="p-6 sm:p-7 relative">
                {/* Animated gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative z-10">
                  {/* Icon with custom gradient */}
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
