import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import CinematicLanding from '@/components/landing/CinematicLanding';

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
      <LandingNav />
      
      <main className="relative z-10">
        <CinematicLanding />
      </main>
    </div>
  );
};

export default Landing;
