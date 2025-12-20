import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What's TaskMate?",
    answer: "TaskMate is an all-in-one task management solution designed to streamline your workflow, manage projects, and empower your team. It combines powerful features with an intuitive interface to help you stay organized and boost productivity."
  },
  {
    question: "Can I try TaskMate for free?",
    answer: "Absolutely! TaskMate offers a free trial that allows you to explore all features without any credit card required. You can start using TaskMate immediately and upgrade to a paid plan when you're ready."
  },
  {
    question: "Is TaskMate mobile-friendly?",
    answer: "Yes, TaskMate is fully responsive and works seamlessly on mobile devices, tablets, and desktops. We also have native mobile apps available for Android, with iOS coming soon."
  },
  {
    question: "How secure is my data?",
    answer: "Security is our top priority. TaskMate uses enterprise-grade security with Firebase authentication and encrypted data storage. Your data is protected with industry-standard encryption and secure cloud infrastructure."
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            For any unanswered questions, reach out to our support team via email, we'll respond as soon as possible to assist you.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/50 rounded-lg px-6 bg-card/50"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;

