import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import CinematicLanding from '@/components/landing/CinematicLanding';
import SEO from '@/components/SEO';
import { faqs } from '@/lib/faqData';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative bg-white dark:bg-[#05020c] transition-colors duration-500">
      <SEO 
        title="TaskMate AI - Smart AI Task Manager & Daily Planner App"
        description="Organize your tasks, automate daily scheduling, and sync collaborative notes with TaskMate AI. A high-performance terminal for teams and developers."
        includeOrgSchema={true}
        includeSoftwareSchema={true}
        faqList={faqs}
      />
      <LandingNav />
      
      <main className="relative z-10">
        <CinematicLanding />
      </main>
    </div>
  );
};

export default Landing;
