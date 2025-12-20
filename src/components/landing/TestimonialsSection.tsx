import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Hasti Delvadiya',
    role: 'Play Store Reviewer',
    content: 'Been using TaskMate for a few days now and it\'s really helpful. The design is clean and simple, and setting up tasks is super quick. Great for keeping my day organized. Loving it so far!',
    rating: 5,
    image: 'H',
    date: '2 July 2025'
  },
  {
    name: 'Lisa Michelle',
    role: 'Play Store Reviewer',
    content: 'Truly an exceptional productivity planning app! This app is full of features that really zero-in on what someone needs to get their tasks schedule in order.',
    rating: 5,
    image: 'L',
    date: '30 July 2025'
  },
  {
    name: 'Mdshipon Shiponhassns',
    role: 'Play Store Reviewer',
    content: 'Amazing app for task management! Simple, intuitive interface with powerful features. Highly recommend for staying organized!',
    rating: 5,
    image: 'M',
    date: '5 December 2025'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Trusted Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"></div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background"></div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 border-2 border-background"></div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">30+ Reviews</span>
        </div>

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by teams around the world
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Simplify project planning, Streamline collaboration, and boost productivity all with TaskMate management solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="group hover:shadow-xl transition-all duration-300 border-border/50"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    {testimonial.date && (
                      <div className="text-xs text-muted-foreground mt-1">{testimonial.date}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
