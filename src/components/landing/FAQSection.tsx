import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What is TaskMate Ecosystem?",
    answer: "TaskMate is a next-generation unified productivity node. It bridges the gap between personal task management, collaborative group circles, and high-fidelity rich note taking, all synchronized in real-time across web and mobile platforms."
  },
  {
    question: "Is the sync truly real-time?",
    answer: "Yes. Our neural sync engine ensures that any update—whether it's a checklist item in a shared note or a task in a group circle—is propagated across all connected devices in under 50ms."
  },
  {
    question: "Can I manage team permissions?",
    answer: "Absolutely. With our Circle Mesh technology, you can create private circles for teams or family, assign ownership, and manage participant access with granular control."
  },
  {
    question: "How do I secure my nodes?",
    answer: "Security is baked into our core architecture. We use industry-standard encryption for all data transmissions and provide secure authentication layers to ensure your productivity nodes remain private."
  }
];

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const FAQSection = () => {
  const { theme } = useTheme();

  return (
    <section id="faq" className={cn(
      "py-24 md:py-48 px-4 transition-colors duration-700 bg-transparent"
    )}>
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12"
          >
            Terminal Logs
          </motion.div>
          
          <h2 className={cn(
            "text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-tight pb-10 transition-colors",
            theme === 'dark' ? "text-white" : "text-black"
          )}>
            SYSTEM <span className="text-gradient italic">FAQ</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className={cn(
                  "border px-10 rounded-[2.5rem] transition-all duration-500 overflow-hidden",
                  theme === 'dark' 
                    ? "border-white/5 bg-black/40 hover:bg-black/60 data-[state=open]:border-primary/40 glow-primary/5" 
                    : "border-black/5 bg-black/[0.01] hover:bg-black/[0.03] data-[state=open]:border-primary/40 shadow-sm"
                )}
              >
                <AccordionTrigger className={cn(
                  "text-left font-black tracking-tighter text-2xl md:text-3xl hover:no-underline py-10 transition-colors",
                  theme === 'dark' ? "text-white hover:text-primary" : "text-black hover:text-primary"
                )}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={cn(
                  "text-base md:text-lg font-bold leading-relaxed pb-10 transition-colors",
                  theme === 'dark' ? "text-white/40" : "text-black/40"
                )}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
