import React from 'react';
import SEO from '@/components/SEO';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05020c] text-slate-200 py-16 px-6 font-sans">
      <SEO 
        title="Privacy Policy - TaskMate AI"
        description="TaskMate AI Privacy Policy. Learn how we handle your data, task syncs, local neural model data processing, and user information."
      />
      <div className="max-w-3xl mx-auto">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-8 gap-2 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <h1 className="text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last updated: June 24, 2026</p>

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              At TaskMate AI, we are committed to keeping your personal data secure. We collect information you provide directly, such as when creating an account, syncing your calendar, or communicating with us.
            </p>
            <p>
              This includes your display name, email address, password, custom tasks, note documents, and circular workspace structures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Process AI Data</h2>
            <p className="mb-3">
              TaskMate AI prioritizes local-first data processing. When you record a voice note, transcriptions are optimized to run on device-level intelligence.
            </p>
            <p>
              Metadata and historical patterns used to surface smart task suggestions are processed locally to maintain data confidentiality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Calendar Integration</h2>
            <p>
              When using our Google Calendar Task Manager synchronization, we request permissions solely to read and write your calendar tasks. Your synchronized calendar tokens are encrypted at rest and never shared with third-party advertising platforms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Web Analytics</h2>
            <p>
              We use functional cookies to retain your workspace session context, interface theme, and default task settings. Aggregate usage data is tracked anonymously via Google Analytics and Microsoft Clarity to optimize our Core Web Vitals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <p>
              We store your data for as long as your account remains active. You may delete your account and associated task lists at any time by navigating to your Account Settings interface.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact Information</h2>
            <p>
              For privacy-related inquiries or request forms, contact us at:{' '}
              <a href="mailto:ck.futuretech@gmail.com" className="text-[#4ABFB8] hover:underline font-semibold">
                ck.futuretech@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
