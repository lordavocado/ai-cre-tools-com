import { siteConfig } from '@/config/site'

export function Hero() {
  return (
    <section className="relative border-b border-neutral-100">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="py-24 md:py-32">
          <div className="mx-auto max-w-[640px] space-y-8">
            <h1 className="font-serif text-[2.5rem] leading-[1.1] tracking-tight text-neutral-900 md:text-[3.5rem]">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href={siteConfig.hero.cta.primary.href}
                className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-900 px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                {siteConfig.hero.cta.primary.text}
              </a>
              <a
                href={siteConfig.hero.cta.secondary.href}
                className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-200 px-8 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                {siteConfig.hero.cta.secondary.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
