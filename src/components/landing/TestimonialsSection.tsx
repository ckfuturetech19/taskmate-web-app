import { Star, Quote } from 'lucide-react';
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
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-card/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">LOVED BY USERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 sm:mb-6 px-4">
            What Our Users Say
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">About TaskMate</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            Join hundreds of satisfied users who have transformed their productivity with TaskMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="group bg-card/70 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 sm:p-7 space-y-4">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/30" />
                
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                    {testimonial.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Play Store rating showcase */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <a 
            href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">5.0 Rating</div>
              <div className="text-sm text-muted-foreground">30+ reviews • 1K+ installs</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
