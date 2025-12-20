
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { revenueCatService } from '@/services/revenueCatService';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const FREE_PLAN: PricingPlan = {
  name: 'Free',
  price: '₹0',
  period: 'forever',
  description: 'Get started with the essentials. Free users can only use one device, get basic reminders, and have read-only access on web.',
  features: [
    '✔ One device',
    '✔ Basic reminders',
    '✔ Read-only web',
  ],
  highlighted: false,
};

const PREMIUM_FEATURES = [
  '🔥 Web editing',
  '🔥 Real-time sync',
  '🔥 AI features',
  '🔥 Group feature & focus tools',
  '🔥 Unlimited everything',
];

const planDetails = [
  {
    key: 'monthly',
    name: 'Premium Monthly',
    description: 'Best for trying premium features with low commitment',
    highlighted: false,
  },
  {
    key: 'yearly',
    name: 'Premium Yearly',
    description: 'Save more with annual billing',
    highlighted: true,
  },
  {
    key: 'lifetime',
    name: 'Premium Lifetime',
    description: 'One-time payment, lifetime access',
    highlighted: false,
  },
];

const PricingSection = () => {
  const [premiumPlans, setPremiumPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    revenueCatService.getPricing()
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.offerings) {
          const plans: PricingPlan[] = planDetails.map((detail) => {
            const offering = res.offerings[detail.key as keyof typeof res.offerings];
            return offering
              ? {
                  name: detail.name,
                  price: offering.displayPrice,
                  period: offering.period,
                  description: detail.description,
                  features: PREMIUM_FEATURES,
                  highlighted: detail.highlighted,
                }
              : null;
          }).filter(Boolean) as PricingPlan[];
          setPremiumPlans(plans);
        } else {
          setError('Could not load pricing.');
        }
        setLoading(false);
      })
      .catch((e) => {
        setError('Could not load pricing.');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Simplify project planning, streamline collaboration, and boost productivity with TaskMate.
          </p>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-8">{error}</div>
        )}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading pricing...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto w-full">
            {/* Free Section */}
            <Card className="relative border-border/50 flex-1 min-w-0 flex flex-col justify-between max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {FREE_PLAN.name}
                </CardTitle>
                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                  <span className="text-4xl font-bold text-foreground">{FREE_PLAN.price}</span>
                  <span className="text-muted-foreground">/ {FREE_PLAN.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{FREE_PLAN.description}</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-3 mb-6">
                  {FREE_PLAN.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Continue with Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Section */}
            <Card className="relative border-border/50 flex-1 min-w-0 flex flex-col justify-between max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Premium
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">Unlock all premium features. Choose your plan below and purchase via our mobile app.</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-3 mb-6">
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-stretch">
                  {premiumPlans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`rounded-lg border p-4 flex flex-col items-center flex-1 min-w-[180px] max-w-xs mx-auto ${plan.highlighted ? 'border-primary/50 shadow-lg md:scale-105' : ''}`}
                      style={{ minWidth: 0 }}
                    >
                      <div className="text-lg font-semibold mb-1 text-center">{plan.name}</div>
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap justify-center">
                        <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2 text-center">{plan.description}</div>
                      <Button
                        className="w-full mt-auto"
                        variant={plan.highlighted ? 'default' : 'outline'}
                        onClick={() => {
                          window.alert('To purchase a premium plan, please download our mobile app and buy your preferred plan there. Then log in here with the same account to access premium features.');
                        }}
                      >
                        Select Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
export default PricingSection;



