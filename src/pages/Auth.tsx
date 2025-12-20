import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Loader2, ClipboardList, CheckCircle, Users, Cloud, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import OnboardingSlides from '@/components/landing/OnboardingSlides';

const Auth = () => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up form state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

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
      toast({
        title: 'Missing fields',
        description: 'Please enter email and password',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      await signInWithEmail(signInEmail, signInPassword);
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !signUpName) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords match',
        variant: 'destructive',
      });
      return;
    }
    
    if (signUpPassword.length < 6) {
      toast({
        title: 'Weak password',
        description: 'Password should be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      await signUpWithEmail(signUpEmail, signUpPassword, signUpName);
      toast({
        title: 'Account created',
        description: 'Welcome to TaskMate!',
      });
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3D7FF] relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Cloud className="absolute top-10 left-10 text-indigo-200 opacity-40 w-32 h-32 animate-float-slow" />
        <ClipboardList className="absolute bottom-10 right-10 text-purple-200 opacity-30 w-24 h-24 animate-float" />
        <CheckCircle className="absolute top-1/2 left-1/4 text-blue-200 opacity-30 w-20 h-20 animate-float" />
        <Sparkles className="absolute bottom-1/4 left-1/3 text-yellow-200 opacity-30 w-16 h-16 animate-float" />
        <Users className="absolute top-1/4 right-1/3 text-pink-200 opacity-30 w-16 h-16 animate-float" />
      </div>
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Login/Signup */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white">
          <div className="mb-8 flex items-center gap-2 justify-center w-full">
            <img src="/assets/images/logo.png" alt="TaskMate Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-[#5B3EFF]">TaskMate</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-black text-center w-full">Welcome Back!</h2>
          <p className="text-gray-500 mb-6 text-center w-full">Please enter login details below</p>
          <Tabs defaultValue="signin" className="w-full max-w-sm mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-transparent">
              <TabsTrigger value="signin" className="font-semibold text-black">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold text-black">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-black">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter the email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-black">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter the Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <div className="flex justify-end mb-2">
                  <Link to="/forgot" className="text-xs text-[#5B3EFF] hover:underline">Forgot password?</Link>
                </div>
                <Button type="submit" className="w-full bg-[#5B3EFF] text-white font-semibold rounded-lg py-2" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign in'}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or continue</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-3 bg-white border border-gray-300 text-black font-semibold rounded-lg py-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Log in with Google
                  </>
                )}
              </Button>
              <div className="text-xs text-center text-gray-500 mt-2">
                Don’t have an account? <Link to="#signup" className="text-[#5B3EFF] hover:underline">Sign Up</Link>
              </div>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-black">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-black">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-black">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-black">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-[#5B3EFF] focus:ring-2 focus:ring-[#5B3EFF]"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#5B3EFF] text-white font-semibold rounded-lg py-2" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or continue</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-3 bg-white border border-gray-300 text-black font-semibold rounded-lg py-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Log in with Google
                  </>
                )}
              </Button>
              <div className="text-xs text-center text-gray-500 mt-2">
                Already have an account? <Link to="#signin" className="text-[#5B3EFF] hover:underline">Sign In</Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Right: Auto-looping onboarding slides */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-100 relative">
          <div className="absolute inset-0 flex items-center justify-center w-full h-full">
            <OnboardingSlides fullScreen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
