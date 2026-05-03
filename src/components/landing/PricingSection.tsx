import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  tag?: string;
}

const FREE_PLAN: PricingPlan = {
  name: 'Free',
  price: 'Free',
  period: 'forever',
  description: 'Get started with the essentials. Perfect for individuals tracking basic tasks.',
  features: [
    '✔ One active device',
    '✔ Basic task management',
    '✔ Read-only web access',
    '✔ Standard notifications',
  ],
  highlighted: false,
};

const PREMIUM_FEATURES = [
  '🔥 Full web editing & sync',
  '🔥 Unlimited devices',
  '🔥 AI-powered task insights',
  '🔥 Group collaboration tools',
  '🔥 Focus timer & analytics',
  '🔥 Custom categories & colors',
];

const PREMIUM_PLANS: PricingPlan[] = [
  {
    name: 'Monthly',
    price: 'Premium',
    period: 'monthly',
    description: 'Best for trying out all features',
    features: PREMIUM_FEATURES,
    highlighted: false,
    tag: 'Flexibility',
  },
  {
    name: 'Yearly',
    price: 'Premium',
    period: 'yearly',
    description: 'Save more with annual commitment',
    features: PREMIUM_FEATURES,
    highlighted: true,
    tag: 'Best Value',
  },
  {
    name: 'Lifetime',
    price: 'Premium',
    period: 'one-time',
    description: 'Pay once, own it forever',
    features: PREMIUM_FEATURES,
    highlighted: false,
    tag: 'Ultimate',
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
              Simple, <span className="text-primary">Transparent</span> Pricing
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Choose the plan that works best for you. Upgrade via our mobile app to unlock the full power of TaskMate.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black mb-2">{FREE_PLAN.name}</CardTitle>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">{FREE_PLAN.price}</span>
                  <span className="text-muted-foreground font-medium">/{FREE_PLAN.period}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{FREE_PLAN.description}</p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {FREE_PLAN.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-primary/20">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full h-12 rounded-xl font-bold transition-all hover:scale-[1.02]"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Plans */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-md rounded-[2.5rem] p-1 shadow-2xl shadow-primary/10">
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-primary">Premium Experience</h3>
                    <p className="text-muted-foreground font-medium mt-1">Unlock the full potential of TaskMate</p>
                  </div>
                  <div className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                    Most Popular
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {PREMIUM_PLANS.map((plan) => (
                    <div
                      key={plan.name}
                      className={cn(
                        "relative group p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center hover:scale-[1.03]",
                        plan.highlighted 
                          ? "bg-background border-primary shadow-xl shadow-primary/10 z-10" 
                          : "bg-background/40 border-border/50 hover:bg-background/60"
                      )}
                    >
                      {plan.tag && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-tighter rounded-full">
                          {plan.tag}
                        </div>
                      )}
                      <div className="text-xl font-black mb-1">{plan.name}</div>
                      <div className="text-2xl font-black text-primary mb-2">{plan.price}</div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4">{plan.period}</div>
                      <p className="text-xs text-muted-foreground font-medium mb-6 line-clamp-2">{plan.description}</p>
                      <Button
                        className="w-full h-10 rounded-xl text-xs font-black transition-all"
                        variant={plan.highlighted ? 'default' : 'outline'}
                        onClick={() => {
                          window.alert('To purchase a premium plan, please download our mobile app. Your status will sync automatically here.');
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-background/50 border border-border/50">
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Premium Features
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {PREMIUM_FEATURES.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="h-4 md:block hidden" />
                    <ul className="grid grid-cols-1 gap-3">
                      {PREMIUM_FEATURES.slice(3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
