import logoImg from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Zap, Globe, ArrowRight, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';

const Auth = () => {
  const { 
    user, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
  } = useAuth();
  const { theme } = useTheme();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast({ title: 'Missing fields', description: 'Please enter both email and password.', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      await signInWithEmail(signInEmail, signInPassword);
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !signUpName) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      await signUpWithEmail(signUpEmail, signUpPassword, signUpName);
      toast({ title: 'Account created', description: 'Welcome to TaskMate!' });
    } catch (error: any) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex bg-transparent relative overflow-hidden font-sans">
      <SEO 
        title="Sign In or Sign Up - TaskMate AI"
        description="Access your high-performance productivity dashboard. Authenticate to manage personal flows, note-taking, and shared team circles."
      />
      {/* Left Panel: Purposeful Content */}
      <div className="flex-1 hidden lg:flex flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-12 text-left"
        >
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoImg} alt="TaskMate Logo" className="w-9 h-9 object-contain rounded-lg animate-pulse" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white relative overflow-hidden">
              TaskMate AI
            </span>
          </div>

          <div className="space-y-6">
            <h1 className={cn(
              "text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9]",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              UNIFIED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A87B] via-[#F0607A] to-[#8B65C8]">ECOSYSTEM</span>
            </h1>
            <p className="text-xl text-[var(--aurora-text-secondary)] font-bold max-w-lg leading-relaxed uppercase tracking-widest">
              Manage personal tasks, collaborative notes, and shared circles in one high-performance terminal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {[
              { icon: User, label: 'Personal Flow', desc: 'Private tasks' },
              { icon: Globe, label: 'Shared Circles', desc: 'Group sync' },
              { icon: Zap, label: 'Real-time', desc: 'Instant updates' },
              { icon: Sparkles, label: 'Rich Notes', desc: 'Collaborative' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all hover:scale-105 duration-300",
                  theme === 'dark' 
                    ? "glass-premium-dark border-white/5 hover:border-[#8B65C8]/40" 
                    : "glass-light border-black/5 hover:border-[#8B65C8]/40 shadow-xs"
                )}
              >
                <f.icon className="h-8 w-8 text-[#8B65C8] mb-4" />
                <h3 className="font-black text-sm uppercase tracking-widest mb-1 text-[var(--aurora-text-primary)]">{f.label}</h3>
                <p className="text-xs text-[var(--aurora-text-muted)] font-bold">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Auth Gate */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10 perspective-[2000px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full max-w-[500px]"
        >
          <div className="mb-12 text-center lg:hidden flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logoImg} alt="TaskMate Logo" className="w-10 h-10 object-contain rounded-lg animate-pulse" />
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white relative overflow-hidden">
                TaskMate AI
              </span>
            </div>
          </div>

          <Card className={cn(
            "rounded-[3rem] border overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#8B65C8]/30",
            theme === 'dark' 
              ? "bg-slate-950/40 border-white/5 backdrop-blur-xl" 
              : "bg-white/70 border-slate-200/50 backdrop-blur-xl"
          )}>
            <CardContent className="p-8 sm:p-12">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className={cn(
                  "grid w-full grid-cols-2 h-14 p-1.5 rounded-2xl mb-12",
                  theme === 'dark' ? "bg-white/5" : "bg-black/5 border border-black/5"
                )}>
                  <TabsTrigger value="signin" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F0607A] data-[state=active]:to-[#8B65C8] data-[state=active]:text-white transition-all duration-300">ACCESS</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F0607A] data-[state=active]:to-[#8B65C8] data-[state=active]:text-white transition-all duration-300">CREATE</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={handleEmailSignIn} className="space-y-8 text-left">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--aurora-text-muted)] ml-1">Terminal Identity</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--aurora-text-muted)]" />
                          <Input 
                            type="email" 
                            placeholder="ENTER_EMAIL"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            className={cn(
                              "h-14 rounded-2xl border pl-12 font-bold tracking-wider transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10" : "bg-black/5 border-black/5 focus:bg-white focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10"
                            )}
                            autoComplete="username"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--aurora-text-muted)] ml-1">Access Key</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--aurora-text-muted)]" />
                          <Input 
                            type={showSignInPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            className={cn(
                              "h-14 rounded-2xl border pl-12 pr-12 font-bold tracking-wider transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10" : "bg-black/5 border-black/5 focus:bg-white focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10"
                            )}
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--aurora-text-muted)] hover:text-[#8B65C8] transition-colors"
                          >
                            {showSignInPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white hover:scale-105 active:scale-95 transition-all font-black text-sm tracking-[0.2em] shadow-2xl shadow-[#F0607A]/20 relative overflow-hidden group"
                      disabled={loading}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5" />
                          INITIALIZING...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          INITIALIZE SESSION
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Create Account Tab */}
                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleEmailSignUp} className="space-y-8 text-left">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--aurora-text-muted)] ml-1">Display Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--aurora-text-muted)]" />
                          <Input 
                            type="text" 
                            placeholder="YOUR_NAME"
                            value={signUpName}
                            onChange={(e) => setSignUpName(e.target.value)}
                            className={cn(
                              "h-14 rounded-2xl border pl-12 font-bold tracking-wider transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10" : "bg-black/5 border-black/5 focus:bg-white focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10"
                            )}
                            autoComplete="name"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--aurora-text-muted)] ml-1">New Identity</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--aurora-text-muted)]" />
                          <Input 
                            type="email" 
                            placeholder="EMAIL_ADDRESS"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            className={cn(
                              "h-14 rounded-2xl border pl-12 font-bold tracking-wider transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10" : "bg-black/5 border-black/5 focus:bg-white focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10"
                            )}
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--aurora-text-muted)] ml-1">Secure Key</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--aurora-text-muted)]" />
                          <Input 
                            type={showSignUpPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            className={cn(
                              "h-14 rounded-2xl border pl-12 pr-12 font-bold tracking-wider transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10" : "bg-black/5 border-black/5 focus:bg-white focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10"
                            )}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--aurora-text-muted)] hover:text-[#8B65C8] transition-colors"
                          >
                            {showSignUpPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white hover:scale-105 active:scale-95 transition-all font-black text-sm tracking-[0.2em] shadow-2xl shadow-[#F0607A]/20 relative overflow-hidden group"
                      disabled={loading}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5" />
                          CREATING...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          CREATE ACCOUNT
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Google Sign In Option */}
              <div className="mt-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--aurora-border)]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={cn(
                      "px-3 font-bold",
                      theme === 'dark' ? "bg-[#181126] text-[var(--aurora-text-muted)]" : "bg-[#fbfafd] text-[var(--aurora-text-muted)]"
                    )}>Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className={cn(
                    "w-full h-14 rounded-2xl border font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center backdrop-blur-md",
                    theme === 'dark' 
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
                      : "bg-white/40 border-black/10 text-black hover:bg-white/60 shadow-xs"
                  )}
                >
                  {googleLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <GoogleIcon />
                      Google Identity
                    </>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
