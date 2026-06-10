import { useTheme } from '@/contexts/ThemeContext';
import { Mic, Sparkles, BellRing, CalendarDays, Target, LayoutGrid } from 'lucide-react';

const FeaturesSection = () => {
  const { theme } = useTheme();

  const featuresList = [
    {
      icon: Mic,
      title: 'Voice to Task',
      description: 'Turn ephemeral thoughts into actionable items just by speaking. High-fidelity transcriptions with context awareness.',
      colorClass: 'text-[#8B65C8]',
      bgClass: 'bg-[#8B65C8]/10 dark:bg-[#8B65C8]/20',
      delay: '0ms',
    },
    {
      icon: Sparkles,
      title: 'AI Smart Suggestions',
      description: 'Let AI handle the prioritization. TaskMate suggests what to do next based on your deadlines and energy levels.',
      colorClass: 'text-[#F0607A]',
      bgClass: 'bg-[#F0607A]/10 dark:bg-[#F0607A]/20',
      delay: '100ms',
    },
    {
      icon: BellRing,
      title: 'Smart Reminders',
      description: "Reminders that adapt. If you're busy, TaskMate intelligently reschedules minor alerts to avoid flow disruption.",
      colorClass: 'text-[#4ABFB8]',
      bgClass: 'bg-[#4ABFB8]/10 dark:bg-[#4ABFB8]/20',
      delay: '200ms',
    },
    {
      icon: CalendarDays,
      title: 'Calendar Sync',
      description: 'Deep integration with Google, Outlook, and Apple calendars. View your tasks and events in one unified AI-curated timeline.',
      colorClass: 'text-[#F5A87B]',
      bgClass: 'bg-[#F5A87B]/10 dark:bg-[#F5A87B]/20',
      delay: '300ms',
    },
    {
      icon: Target,
      title: 'Focus Mode Pro',
      description: 'A sanctuary for deep work. Block distractions and track focus duration with a minimalist, beautiful timer UI.',
      colorClass: 'text-[#8B65C8]',
      bgClass: 'bg-[#8B65C8]/10 dark:bg-[#8B65C8]/20',
      delay: '400ms',
    },
    {
      icon: LayoutGrid,
      title: 'Home Widgets',
      description: 'Stay updated without opening the app. Beautiful, glassmorphic widgets for your home and lock screen.',
      colorClass: 'text-[#4ABFB8]',
      bgClass: 'bg-[#4ABFB8]/10 dark:bg-[#4ABFB8]/20',
      delay: '500ms',
    },
  ];

  return (
    <section id="features" className="py-32 bg-[var(--aurora-bg-primary)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[var(--aurora-text-primary)]">Built for elite performance</h2>
          <p className="text-[var(--aurora-text-secondary)] max-w-2xl mx-auto text-lg">
            TaskMate AI isn't just a list; it's a cognitive extension that understands your workflow.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--aurora-border)] border border-[var(--aurora-border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
          {featuresList.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="bg-[var(--aurora-bg-secondary)] p-10 hover:bg-[var(--aurora-bg-tertiary)] transition-all duration-500 group cursor-default border border-transparent hover:border-[var(--aurora-border-hover)]"
                style={{ transitionDelay: feature.delay }}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bgClass} flex items-center justify-center ${feature.colorClass} text-3xl mb-8 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--aurora-text-primary)]">{feature.title}</h3>
                <p className="text-[var(--aurora-text-secondary)] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
