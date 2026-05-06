import { Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Hasti Delvadiya',
    role: 'Product Architect',
    content: 'TaskMate has completely redefined how I manage my cognitive load. The real-time sync between my notes and tasks is flawless. It feels like an extension of my brain.',
    rating: 5,
    image: 'H',
    date: '2 July 2024'
  },
  {
    name: 'Lisa Michelle',
    role: 'Creative Director',
    content: 'The most exceptional productivity interface I\'ve ever encountered. It zero-in on exactly what you need without the legacy clutter of other apps.',
    rating: 5,
    image: 'L',
    date: '30 July 2024'
  },
  {
    name: 'Mdshipon Shiponhassns',
    role: 'Lead Developer',
    content: 'Amazing ecosystem for team collaboration! The Circle Mesh technology makes group management intuitive and powerful. Highly recommend for high-velocity teams.',
    rating: 5,
    image: 'M',
    date: '5 December 2024'
  }
];

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const TestimonialsSection = () => {
  const { theme } = useTheme();

  return (
    <section id="testimonials" className={cn(
      "py-24 md:py-48 px-4 transition-colors duration-700 relative overflow-hidden bg-transparent"
    )}>
      {/* Background Active Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12"
          >
            Social Validation
          </motion.div>
          
          <h2 className={cn(
            "text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-tight pb-10 transition-colors",
            theme === 'dark' ? "text-white" : "text-black"
          )}>
            LOVED BY <span className="text-gradient italic">CREATORS</span>
          </h2>
          <p className={cn(
            "text-lg md:text-2xl max-w-2xl font-bold uppercase tracking-[0.3em] transition-colors",
            theme === 'dark' ? "text-white/40" : "text-black/40"
          )}>
            Global teams accelerating their workflow on TaskMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "p-12 border transition-all duration-1000 group rounded-[2.5rem] relative overflow-hidden",
                theme === 'dark' 
                  ? "bg-black/40 border-white/5 hover:border-primary/30" 
                  : "bg-white border-black/5 hover:border-primary/20 shadow-xl"
              )}
            >
              <div className="flex gap-2 mb-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              
              <p className={cn(
                "text-xl md:text-2xl font-bold leading-tight mb-16 transition-colors italic tracking-tight",
                theme === 'dark' ? "text-white/80" : "text-black/80"
              )}>
                "{testimonial.content}"
              </p>
              
              <div className={cn(
                "flex items-center gap-6 pt-10 border-t transition-colors",
                theme === 'dark' ? "border-white/5" : "border-black/5"
              )}>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  {testimonial.image}
                </div>
                <div>
                  <div className={cn("text-lg font-black tracking-tight", theme === 'dark' ? "text-white" : "text-black")}>{testimonial.name}</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
