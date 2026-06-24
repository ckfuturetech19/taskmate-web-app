export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
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
