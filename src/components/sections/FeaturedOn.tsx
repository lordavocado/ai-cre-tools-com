export function FeaturedOn() {
  return (
    <section className="py-12 md:py-16 border-t bg-background/50">
      <div className="container pl-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured On</h2>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <a 
              href="https://fazier.com/launches/www.aicretools.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" 
                width={120} 
                alt="Fazier badge" 
                className="h-auto"
              />
            </a>
            <a 
              href="https://startupfa.me/s/ai-cre-tools?utm_source=www.aicretools.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://startupfa.me/badges/featured-badge-small.webp" 
                alt="Featured on Startup Fame" 
                width={224} 
                height={36}
                className="h-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}