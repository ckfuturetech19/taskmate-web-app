import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, X } from 'lucide-react';

const PricingSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Perfect for individuals getting started with AI productivity.',
      features: [
        { text: 'Basic AI Suggestions', available: true },
        { text: 'Up to 50 tasks/day', available: true },
        { text: 'Advanced Voice Support', available: false },
        { text: 'Team Collaboration', available: false },
      ],
      cta: 'Start Free',
      recommended: false,
    },
    {
      name: 'Pro',
      priceMonthly: 199,
      priceAnnual: 159,
      description: 'Advanced tools for power users who want maximum efficiency.',
      features: [
        { text: 'Unlimited AI Tasks', available: true },
        { text: 'Full Voice Capture', available: true },
        { text: 'Focus Mode Pro', available: true },
        { text: 'Custom App Themes', available: true },
      ],
      cta: 'Get Started Now',
      recommended: true,
    },
    {
      name: 'Team',
      priceMonthly: 499,
      priceAnnual: 399,
      description: 'Collaborative workspace for teams to stay aligned effortlessly.',
      features: [
        { text: 'Everything in Pro', available: true },
        { text: 'Shared Team Workspaces', available: true },
        { text: 'Advanced Analytics', available: true },
        { text: 'Priority Support', available: true },
      ],
      cta: 'Talk to Sales',
      recommended: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-[var(--aurora-bg-secondary)]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-[var(--aurora-text-primary)]">Simple, straightforward pricing</h2>
        
        {/* Billing Switcher Toggle */}
        <div className="inline-flex items-center bg-[var(--aurora-bg-primary)] p-1.5 rounded-2xl border border-[var(--aurora-border)] mb-16 shadow-inner">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !isAnnual 
                ? 'bg-[#8B65C8] text-white shadow-lg' 
                : 'text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-text-primary)]'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              isAnnual 
                ? 'bg-[#8B65C8] text-white shadow-lg' 
                : 'text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-text-primary)]'
            }`}
          >
            Annual <span className="text-[10px] px-2 py-0.5 bg-[#4ABFB8]/20 text-[#4ABFB8] rounded-md font-extrabold">Save 20%</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
          {plans.map((plan, i) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div 
                key={i} 
                className={`pricing-card bg-[var(--aurora-bg-primary)] border rounded-[2.5rem] text-left hover:scale-[1.02] transition-transform ${
                  plan.recommended 
                    ? 'aurora-pro-card-glow border-2 border-[#8B65C8] p-12 relative z-10 scale-105 hover:scale-[1.07]' 
                    : 'border-[var(--aurora-border)] p-10'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">
                    Recommended
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2 text-[var(--aurora-text-primary)]">{plan.name}</h3>
                
                <div className="text-5xl font-black mb-6 text-[var(--aurora-text-primary)] flex items-baseline">
                  ₹{price}
                  <span className="text-lg text-[var(--aurora-text-muted)] font-bold ml-1">/mo</span>
                </div>
                
                <p className="text-sm text-[var(--aurora-text-secondary)] mb-10 leading-relaxed min-h-[48px]">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${!feature.available ? 'opacity-40' : ''}`}>
                      {feature.available ? (
                        <Check className="w-5 h-5 text-[#4ABFB8] shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-[var(--aurora-text-muted)] shrink-0" />
                      )}
                      <span className="text-[var(--aurora-text-secondary)]">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/auth')}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${
                    plan.recommended 
                      ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white font-extrabold shadow-xl hover:scale-105' 
                      : 'border border-[var(--aurora-border)] text-[var(--aurora-text-primary)] hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
