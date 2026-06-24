import React from 'react';
import SEO from '@/components/SEO';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <SEO 
        title="Contact Us - TaskMate AI"
        description="Have questions or feedback? Contact the TaskMate AI support team. We generally respond to inquiries within 24 hours."
      />
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-foreground">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          For any questions, feedback, or support, please email us at:
        </p>
        <a
          href="mailto:ck.futuretech@gmail.com"
          className="text-primary font-semibold text-lg underline mb-4 break-all"
        >
          ck.futuretech@gmail.com
        </a>
        <p className="text-sm text-muted-foreground text-center">
          We usually respond within 24 hours. Thank you for reaching out!
        </p>
      </div>
    </div>
  );
};

export default Contact;
