import logoImg from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, ShieldCheck, Zap, Globe, KeyRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { 
    user, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendOTP, 
    verifyOTP 
  } = useAuth();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  
  const [otpEmail, setOtpEmail] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast({ title: 'Missing fields', description: 'Please enter email and password', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      await signInWithEmail(signInEmail, signInPassword);
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message || 'Failed to sign in', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !signUpName) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      await signUpWithEmail(signUpEmail, signUpPassword, signUpName);
      toast({ title: 'Account created', description: 'Welcome to TaskMate!' });
    } catch (error: any) {
      toast({ title: 'Sign up failed', description: error.message || 'Failed to create account', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail) {
      toast({ title: 'Missing email', description: 'Please enter your email', variant: 'destructive' });
      return;
    }
    try {
      setOtpLoading(true);
      await sendOTP(otpEmail);
      setOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Please check your email for the 6-digit code.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send OTP', variant: 'destructive' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter the 6-digit code', variant: 'destructive' });
      return;
    }
    try {
      setOtpLoading(true);
      await verifyOTP(otpEmail, otpCode, otpName);
      toast({ title: 'Success', description: 'Logged in successfully!' });
    } catch (error: any) {
      toast({ title: 'Verification failed', description: error.message || 'Invalid OTP', variant: 'destructive' });
    } finally {
      setOtpLoading(false);
    }
  };


  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden font-outfit transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 dark:bg-accent/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />

      {/* Left Panel: Brand & Features (Desktop) */}
      <div className="flex-1 hidden lg:flex flex-col justify-center px-16 xl:px-32 bg-muted/20 dark:bg-muted/5 border-r border-border/50 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2.5 bg-primary rounded-2xl shadow-xl shadow-primary/20 rotate-3">
              <img src={logoImg} alt="TaskMate" className="h-9 w-9 invert dark:invert-0" />
            </div>
            <span className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
              TaskMate
            </span>
          </div>
          
          <h1 className="text-6xl xl:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Work smart. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Live better.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
            The ultimate productivity hub. Synchronize your tasks, collaborate with groups, and track your progress with beautiful analytics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, text: 'Real-time Engine', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { icon: ShieldCheck, text: 'Secure & Private', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: Globe, text: 'Cross-platform', color: 'text-sky-500', bg: 'bg-sky-500/10' },
              { icon: Sparkles, text: 'AI-Powered Insights', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (0.1 * i) }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-md hover:border-primary/30 transition-all group"
              >
                <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", feature.bg)}>
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <span className="font-bold text-sm xl:text-base">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Abstract decor */}
        <div className="absolute bottom-10 left-10 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary" />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10 lg:hidden">
             <div className="inline-block p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4">
               <img src={logoImg} alt="TaskMate" className="h-10 w-10 invert dark:invert-0" />
             </div>
             <h2 className="text-4xl font-black tracking-tight">Welcome Back</h2>
             <p className="text-muted-foreground mt-2 font-medium">Continue your journey with TaskMate</p>
          </div>

          <Card className="border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-card/70 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-10 p-1.5 bg-muted/50 rounded-2xl">
                  <TabsTrigger value="signin" className="rounded-xl py-3 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">Sign In</TabsTrigger>
                  <TabsTrigger value="otp" className="rounded-xl py-3 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">OTP Login</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl py-3 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">Sign Up</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="signin" className="mt-0 focus-visible:outline-none">
                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Email Address</Label>
                        <Input 
                          type="email" 
                          placeholder="name@example.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="h-14 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium px-5"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <Label className="text-xs uppercase tracking-widest font-black text-muted-foreground">Password</Label>
                          <Link to="/forgot" className="text-xs text-primary font-bold hover:underline transition-colors">Forgot Password?</Link>
                        </div>
                        <Input 
                          type="password" 
                          placeholder="••••••••"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="h-14 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium px-5"
                        />
                      </div>
                      <Button className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Log In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="otp" className="mt-0 focus-visible:outline-none">
                     {!otpSent ? (
                       <form onSubmit={handleRequestOTP} className="space-y-5">
                         <div className="space-y-2">
                           <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Email Address</Label>
                           <Input 
                             type="email" 
                             placeholder="name@example.com"
                             value={otpEmail}
                             onChange={(e) => setOtpEmail(e.target.value)}
                             className="h-14 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium px-5"
                           />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Full Name (Optional)</Label>
                            <Input 
                              type="text" 
                              placeholder="John Doe"
                              value={otpName}
                              onChange={(e) => setOtpName(e.target.value)}
                              className="h-14 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium px-5"
                            />
                          </div>
                         <Button className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4" disabled={otpLoading}>
                           {otpLoading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Send OTP'}
                         </Button>
                       </form>
                     ) : (
                       <form onSubmit={handleVerifyOTP} className="space-y-5">
                         <div className="space-y-2 text-center">
                           <p className="text-sm font-medium text-muted-foreground">OTP sent to <span className="text-primary font-bold">{otpEmail}</span></p>
                         </div>
                         <div className="space-y-2">
                           <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Verification Code</Label>
                           <Input 
                             type="text" 
                             maxLength={6}
                             placeholder="123456"
                             value={otpCode}
                             onChange={(e) => setOtpCode(e.target.value)}
                             className="h-16 text-center text-2xl tracking-[0.5em] font-black rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all px-5"
                           />
                         </div>
                         <Button className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4" disabled={otpLoading}>
                           {otpLoading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Verify & Login'}
                         </Button>
                         <button 
                           type="button" 
                           onClick={() => setOtpSent(false)} 
                           className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors mt-2"
                         >
                           Change Email
                         </button>
                       </form>
                     )}
                   </TabsContent>

                  <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Full Name</Label>
                        <Input 
                          placeholder="John Doe"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          className="h-13 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 px-5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Email</Label>
                        <Input 
                          type="email" 
                          placeholder="name@example.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="h-13 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 px-5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Password</Label>
                          <Input 
                            type="password" 
                            placeholder="Min 6"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            className="h-13 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 px-5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest font-black ml-1 text-muted-foreground">Confirm</Label>
                          <Input 
                            type="password" 
                            placeholder="Repeat"
                            value={signUpConfirmPassword}
                            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                            className="h-13 rounded-2xl bg-muted/30 border-muted-foreground/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 px-5"
                          />
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </AnimatePresence>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full opacity-50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                    <span className="bg-card px-4 text-muted-foreground font-black">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl border-2 border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all font-bold gap-4 text-base"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-10 font-medium leading-relaxed">
                  By joining TaskMate, you agree to our <br />
                  <Link to="/terms" className="text-primary font-bold hover:underline transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-bold hover:underline transition-colors">Privacy Policy</Link>
                </p>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
