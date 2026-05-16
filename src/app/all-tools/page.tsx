import type { Metadata } from "next";
import Link from "next/link";
import { getDirectoryItems } from "@/lib/supabase";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/config/design-tokens";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `All AI CRE Tools (A–Z) | ${siteConfig.name}`,
  description: `Browse every AI tool in the ${siteConfig.name} directory. Alphabetical index with links to reviews, features, and comparisons for commercial real estate teams.`,
  alternates: {
    canonical: `${siteConfig.url}/all-tools`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AllToolsPage() {
  const items = await getDirectoryItems();
  const sortedItems = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );

  const groupedByLetter = sortedItems.reduce<Record<string, typeof sortedItems>>((groups, item) => {
    const letter = (item.name.charAt(0).toUpperCase().match(/[A-Z]/) ? item.name.charAt(0).toUpperCase() : "#");
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(item);
    return groups;
  }, {});

  const letters = Object.keys(groupedByLetter).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "All AI CRE Tools",
            description: `Complete alphabetical index of ${siteConfig.categoryName.toLowerCase()}.`,
            url: `${siteConfig.url}/all-tools`,
            numberOfItems: sortedItems.length,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: sortedItems.length,
              itemListElement: sortedItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: `${siteConfig.url}/${item.slug}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-[#737373]">
            <Link href="/" className="transition-colors hover:text-[#1f1f1f]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#1f1f1f]">All tools</span>
          </nav>

          <h1 className="text-[32px] font-medium leading-[1.15] tracking-[-0.01em] text-[#1f1f1f] sm:text-[40px]">
            All AI CRE tools
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#737373] sm:text-base">
            Complete directory index with a link to every tool review. Use this page to discover
            software by name, or browse by{" "}
            <Link href="/categories" className="font-medium text-[#1f1f1f] underline-offset-2 hover:underline">
              category
            </Link>
            .
          </p>
          <p className="mt-2 text-sm text-[#737373]">
            <strong className="font-semibold text-[#1f1f1f]">{sortedItems.length}</strong> tools indexed
          </p>

          <nav aria-label="Jump to letter" className="mt-8 flex flex-wrap gap-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-[6px] border border-[#e0e0e0] bg-white px-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:border-[#c8c8c8] hover:bg-[#fafafa]"
              >
                {letter}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-12 md:py-16">
        <div className="container space-y-12 px-6">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
              <h2 className="mb-4 text-lg font-semibold text-[#1f1f1f]">{letter}</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedByLetter[letter].map((item) => {
                  const primaryCategory = item.category.split(",")[0]?.trim();
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/${item.slug}`}
                        className="group flex flex-col rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-3 transition-colors hover:border-[#c8c8c8]"
                      >
                        <span className="text-sm font-medium text-[#1f1f1f] group-hover:text-[#629649]">
                          {item.name}
                        </span>
                        {primaryCategory && (
                          <span className="mt-1 text-xs text-[#737373]">
                            {getCategoryLabel(primaryCategory)}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
