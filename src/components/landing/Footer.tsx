import { CheckSquare, Mail, Shield, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-4 border-t border-border bg-gradient-to-b from-card/50 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="../../assets/images/logo.png" 
                alt="TaskMate Logo" 
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">TaskMate</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your smart companion for managing tasks, boosting productivity, and achieving goals.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Personal Tasks</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Team Collaboration</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Recurring Tasks</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Cloud Sync</li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Web App</span>
              </li>
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Android App
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">1K+</span>
                </a>
              </li>
              <li className="text-muted-foreground">iOS (Coming Soon)</li>
              <li className="text-muted-foreground">Desktop (Coming Soon)</li>
            </ul>
          </div>

          {/* Trust Indicators */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Why TaskMate?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Email Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskMate. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
