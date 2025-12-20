const IntegrationsSection = () => {
  const integrations = [
    'Slack',
    'Google Analytics',
    'Gmail',
    'Google Drive',
    'Asana',
    'Dropbox',
    'TikTok',
    'Facebook'
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Integrations with your favorite tools
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your workflow and enhance productivity with smart tools and seamless automation. Get more done in less time, effortlessly.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Logo */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-bold text-primary">PayPal</span>
            </div>
          </div>

          {/* Integration Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
            {integrations.map((integration) => (
              <div
                key={integration}
                className="h-20 md:h-24 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <span className="text-xs md:text-sm font-semibold text-foreground text-center px-2">
                  {integration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;

