import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 relative bg-[var(--aurora-bg-primary)]">
      <div className="container mx-auto px-6">
        <div className="relative bg-gradient-to-br from-[#8B65C8]/20 via-[var(--aurora-bg-secondary)] to-[#4ABFB8]/20 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden border border-[var(--aurora-border)] shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-[var(--aurora-text-primary)]">Ready to plan smarter?</h2>
            <p className="text-[var(--aurora-text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Join 1,200+ users who have transformed their life with TaskMate AI. Download for free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              >
                Download for Android
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-5 border border-white/10 bg-white/5 text-[var(--aurora-text-primary)] font-black rounded-2xl hover:bg-white/10 active:scale-95 transition-colors"
              >
                See on Product Hunt
              </button>
            </div>
          </div>
          
          {/* Subtle textured layer */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
