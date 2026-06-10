import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is TaskMate AI really free?',
      answer: 'Yes! Our basic plan is free forever and includes unlimited tasks, voice input, and reminders. We only charge for premium AI features and team collaboration.',
    },
    {
      question: 'Which platforms is it available on?',
      answer: 'Currently, we are natively available on Android. iOS and Web versions are in active development and will be launching soon.',
    },
    {
      question: 'How does the AI suggestion engine work?',
      answer: 'TaskMate uses local neural models to analyze your historical task completion patterns, deadlines, and current focus hours to surface the most relevant tasks.',
    },
    {
      question: 'Can I use TaskMate offline?',
      answer: 'Absolutely. All your tasks are stored locally first. Changes will sync to the cloud automatically once you\'re back online.',
    },
    {
      question: 'Is team collaboration available now?',
      answer: 'Yes, Team workspaces are available under the Team plan. You can share projects, assign tasks, and track group progress in real-time.',
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 bg-[var(--aurora-bg-primary)]">
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[var(--aurora-text-primary)]">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div 
                key={i} 
                className="border-b border-[var(--aurora-border)] pb-4"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left py-4 focus:outline-hidden group"
                >
                  <span className={`text-[18px] font-semibold transition-colors duration-300 ${
                    isOpen ? 'text-[#8B65C8]' : 'text-[var(--aurora-text-primary)] group-hover:text-[#8B65C8]'
                  }`}>
                    {faq.question}
                  </span>
                  <Plus className={`w-5 h-5 text-[var(--aurora-text-secondary)] transition-transform duration-300 ${
                    isOpen ? 'rotate-45 text-[#8B65C8]' : ''
                  }`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-48 mt-2 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[var(--aurora-text-secondary)] leading-relaxed pb-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
