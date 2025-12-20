const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const privacyPolicyUrl = 'https://chiragmali19.github.io/privacy-policy/';

  return (
    <footer id="contacts" className="py-12 md:py-16 px-4 bg-card/50 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
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
              Streamline your workflow, manage projects and empower your team.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a 
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('contacts')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

