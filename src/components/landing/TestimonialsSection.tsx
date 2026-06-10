import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonialsList = [
    {
      name: 'Rahul Sharma',
      role: 'Product Designer, Bangalore',
      content: 'TaskMate AI has completely changed how I manage my freelance projects. The voice input is scary accurate — it feels like having a real assistant.',
      initials: 'RS',
      gradient: 'from-[#F5A87B] to-[#F0607A]',
    },
    {
      name: 'Ananya Misra',
      role: 'Project Manager, Mumbai',
      content: "As a PM, my day is scattered. TaskMate's AI suggestions surface exactly what I need to focus on next. No more scrolling through endless lists.",
      initials: 'AM',
      gradient: 'from-[#8B65C8] to-[#4ABFB8]',
    },
    {
      name: 'Vikram Kapoor',
      role: 'Android Developer, Gurgaon',
      content: 'Finally, a task manager that understands Android design language. The widgets are beautiful and actually functional.',
      initials: 'VK',
      gradient: 'from-[#F0607A] to-[#8B65C8]',
    },
  ];

  // Duplicate the list to ensure seamless infinite looping scroll
  const doubleList = [...testimonialsList, ...testimonialsList, ...testimonialsList];

  return (
    <section className="py-32 bg-[var(--aurora-bg-primary)] overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl font-extrabold text-[var(--aurora-text-primary)]">Loved by productivity experts</h2>
      </div>

      <div className="aurora-marquee-container relative w-full overflow-hidden py-4">
        <div className="aurora-marquee-track">
          {doubleList.map((item, i) => (
            <div 
              key={i} 
              className="w-[380px] shrink-0 p-8 rounded-3xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] hover:border-[#8B65C8]/30 transition-all text-left"
            >
              <div className="flex gap-1 text-[#F5A87B] mb-6">
                {[...Array(5)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[var(--aurora-text-primary)] text-lg italic mb-8 opacity-90 leading-relaxed">
                "{item.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center font-bold text-white shadow-lg`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--aurora-text-primary)]">{item.name}</h4>
                  <p className="text-xs text-[var(--aurora-text-muted)]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
