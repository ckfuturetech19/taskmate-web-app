import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { ArrowLeft, Send, Mail, User, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import api from '@/services/apiService';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('/feedback/public', { name, email, message });
      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We have sent a confirmation to your email.',
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Could not send message. Please try again later.';
      toast({
        title: 'Failed to send',
        description: errMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05020c] text-slate-200 py-16 px-6 font-sans flex flex-col justify-center items-center relative overflow-hidden">
      <SEO 
        title="Contact Us - TaskMate AI"
        description="Have questions or feedback? Contact the TaskMate AI support team. Send us a message and we'll reply within 24 hours."
      />

      {/* Decorative Blur Blob */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#8B65C8]/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-8 gap-2 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
          <p className="text-sm text-slate-400">
            Have questions, feature suggestions, or business inquiries? Drop us a message below.
          </p>
        </div>

        <Card className={cn(
          "rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#8B65C8]/30",
          theme === 'dark' 
            ? "bg-slate-955/40 border-white/5 backdrop-blur-xl" 
            : "bg-slate-900/60 border-white/5 backdrop-blur-xl"
        )}>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4B8E8] ml-1">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 rounded-2xl border pl-12 font-bold tracking-wider transition-all bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4B8E8] ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl border pl-12 font-bold tracking-wider transition-all bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4B8E8] ml-1">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
                  <Textarea 
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="rounded-2xl border pl-12 pt-4 font-semibold transition-all bg-white/5 border-white/5 focus:border-[#8B65C8]/50 focus:ring-2 focus:ring-[#8B65C8]/10 text-white min-h-[120px]"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white hover:scale-105 active:scale-95 transition-all font-black text-sm tracking-[0.2em] shadow-2xl relative overflow-hidden group"
                disabled={loading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    SENDING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    SEND MESSAGE
                    <Send className="h-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-400">
                Or email us directly at:{' '}
                <a href="mailto:ck.futuretech@gmail.com" className="text-[#4ABFB8] font-bold hover:underline">
                  ck.futuretech@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
