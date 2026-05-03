import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Directory-aligned cards (`DESIGN.md` / `DirectoryItemCard`) */
export const adminCardClass =
  'rounded-[8px] border border-[#e0e0e0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]';

/** Inputs aligned with public directory search (`DirectorySearch`) */
export const adminInputClass =
  'h-11 rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] placeholder:text-[#999999] shadow-none transition-colors focus-visible:border-[#629649] focus-visible:ring-1 focus-visible:ring-[#629649] focus-visible:outline-none';

export const adminTextareaClass =
  'min-h-[100px] rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] placeholder:text-[#999999] shadow-none transition-colors focus-visible:border-[#629649] focus-visible:ring-1 focus-visible:ring-[#629649] focus-visible:outline-none';

export const adminSelectTriggerClass =
  'h-11 rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] shadow-none focus:ring-1 focus:ring-[#629649] data-[placeholder]:text-[#999999]';

type AdminHeroProps = {
  kicker?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

/**
 * Hero band matching homepage / submit-tool editorial layout (muted strip + ink typography).
 */
export function AdminHero({ kicker = 'Admin', title, description, actions }: AdminHeroProps) {
  return (
    <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-10 md:py-14">
      <div className="container px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">{kicker}</p>
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-[-0.02em] text-[#0f172a] sm:text-3xl md:text-[34px] md:leading-tight">
              {title}
            </h1>
            {description ? (
              <div className="mt-3 max-w-2xl text-sm leading-relaxed text-[#737373] md:text-[15px]">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">{actions}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type AdminContentProps = {
  children: ReactNode;
  className?: string;
};

export function AdminContent({ children, className }: AdminContentProps) {
  return <div className={cn('container px-6 py-10 md:py-12', className)}>{children}</div>;
}

type AdminBackLinkProps = {
  href: string;
  children: ReactNode;
};

export function AdminBackLink({ href, children }: AdminBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#1f1f1f] underline-offset-4 transition-colors hover:text-[#629649] hover:underline"
    >
      {children}
    </Link>
  );
}

/** Shared sign-out control for admin chrome */
export function AdminSignOutButton() {
  return (
    <form action="/api/admin/logout" method="post">
      <Button type="submit" variant="outline" className="rounded-[8px] border-[#e0e0e0]">
        Sign Out
      </Button>
    </form>
  );
}
