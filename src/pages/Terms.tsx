import React from 'react';
import SEO from '@/components/SEO';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05020c] text-slate-200 py-16 px-6 font-sans">
      <SEO 
        title="Terms of Service - TaskMate AI"
        description="TaskMate AI Terms of Service. Review the conditions, software licenses, calendar integration usage, and operational policies."
      />
      <div className="max-w-3xl mx-auto">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-8 gap-2 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <h1 className="text-4xl font-extrabold text-white mb-8">Terms of Service</h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last updated: June 24, 2026</p>

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the TaskMate AI applications, web portal, or local services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              TaskMate AI is a smart to-do application, daily planner, and calendar synchronization software. We offer standard productivity tools free of charge, with premium upgrades available for advanced AI agent processing and high-frequency group sync capacities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Account Integrity</h2>
            <p>
              You are responsible for safeguarding your access credentials and for all operations performed under your session. If you detect unauthorized access to your account, you must alert support immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
            <p>
              TaskMate AI, its original features, and brand designs are owned by CK Future Tech and are protected by applicable intellectual property regulations. You may not distribute or copy our software code without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties</h2>
            <p>
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. TaskMate AI makes no guarantees regarding the uninterrupted availability, response speed, or zero-loss integrity of synced data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and interpreted in accordance with state and national regulations, excluding its conflicts of law parameters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Support Inquiries</h2>
            <p>
              Please address all service queries or compliance notices to:{' '}
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

export default Terms;
