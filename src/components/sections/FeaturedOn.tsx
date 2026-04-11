export function FeaturedOn() {
  return (
    <section className="border-t border-gray-200 py-10 md:py-14">
      <div className="container px-6">
        <div className="text-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-gray-400">Featured on</p>
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