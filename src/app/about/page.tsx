import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getCategories, getDirectoryItems } from '@/lib/sheets';
import { getRecentGuides } from '@/lib/markdown';
import { CategoryCard } from '@/components/category/CategoryCard';
import { DirectoryItemCard } from '@/components/listing/DirectoryItemCard';
import { GuideCard } from '@/components/guide/GuideCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `About ${siteConfig.categoryName} - Find the best Product Analytics Tools & Comparison Guide`,
  description: `Learn about our comprehensive ${siteConfig.categoryName.toLowerCase()} directory. Created by product manager Nichlas Kvist Campos to help teams find and compare the best analytics tools for data-driven decisions.`,
  keywords: [
    ...siteConfig.keywords,
    'product analytics comparison',
    'analytics tools directory',
    'product metrics tools',
    'data analytics platforms',
    'analytics software guide',
    'product analytics expert',
    'analytics tools review'
  ],
  openGraph: {
    title: `About ${siteConfig.categoryName} Directory`,
    description: `Comprehensive database and comparison guide for ${siteConfig.categoryName.toLowerCase()}. Find the perfect analytics solution for your product team.`,
    url: `${siteConfig.url}/about`,
    type: 'website',
  },
};

export default async function AboutPage() {
  // Fetch data for showcasing
  const categories = await getCategories();
  const allTools = await getDirectoryItems();
  const recentGuides = await getRecentGuides(3);
  
  // Get random selections
  const featuredCategories = categories.slice(0, 3);
  const featuredTools = allTools
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About {siteConfig.categoryName}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive directory for finding and comparing the best {siteConfig.categoryName.toLowerCase()}
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why This {siteConfig.categoryName} Directory Exists</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Finding the right {siteConfig.categoryName.toLowerCase()} for your product team shouldn't be a nightmare. Yet here we are - spending hours googling, reading through countless blog posts, and still ending up more confused than when we started.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              This directory was created by Nichlas, a product manager from Denmark who got quite frustrated with this exact problem. As someone working in product management, he needed a proper overview of what's actually out there in the {siteConfig.categoryName.toLowerCase()} space. The tools, the features, the pricing - everything in one place where you could actually compare them without having to open 47 different tabs.
            </p>
            <p className="text-lg text-muted-foreground">
              So he thought, why not gather them all in one place? Not just for himself, but for all the other product managers, analysts, and team leads who are struggling with the same problem. That's how this comprehensive {siteConfig.categoryName.toLowerCase()} directory was born.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Image
              src="/market-analysis-10.png"
              alt="Product analytics and market analysis illustration showing data visualization and business insights"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">What You'll Find in Our {siteConfig.categoryName} Directory</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Tool Directory</h3>
              <p className="text-muted-foreground">
                From the big players like Google Analytics and Mixpanel to the newer, more specialized {siteConfig.categoryName.toLowerCase()} - we've included everything that's worth considering for product analytics and user behavior tracking.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Real Comparisons</h3>
              <p className="text-muted-foreground">
                Not just marketing fluff, but actual feature comparisons that help you understand what each {siteConfig.categoryName.toLowerCase().slice(0, -1)} is good for and where it might fall short in real-world scenarios.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Practical Guides</h3>
              <p className="text-muted-foreground">
                Based on real experience using these {siteConfig.categoryName.toLowerCase()} in product teams. The kind of insights you usually only get from colleagues who've actually implemented and used these platforms.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Regular Updates</h3>
              <p className="text-muted-foreground">
                The {siteConfig.categoryName.toLowerCase()} space moves fast, with new features, pricing changes, and emerging platforms. We keep track of these updates so you don't have to.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Story Behind This {siteConfig.categoryName} Directory</h2>
          <p className="text-lg text-muted-foreground mb-4">
            This directory was built by someone who's been working in product management for several years, mostly with tech companies that needed to make sense of their user data. You know the drill - stakeholders asking for metrics, trying to figure out which features actually work, and making decisions based on more than just gut feeling.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Through this work, Nichlas has had the chance (and sometimes the pain) of implementing and using quite a few different {siteConfig.categoryName.toLowerCase()}. Some were great, some were... well, let's just say they taught him what to avoid next time.
          </p>
          <p className="text-lg text-muted-foreground">
            This hands-on experience with various {siteConfig.categoryName.toLowerCase()} is what we're sharing here. Not the polished marketing version, but the real story of what it's like to actually use these platforms day-to-day in product teams.
          </p>
        </div>

        {/* Featured Categories Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore {siteConfig.categoryName} by Category</h2>
              <p className="text-lg text-muted-foreground">
                Browse our organized categories to find the perfect analytics solution for your needs.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/categories">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="bg-secondary/20 rounded-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured {siteConfig.categoryName}</h2>
              <p className="text-lg text-muted-foreground">
                Check out some of the top-rated {siteConfig.categoryName.toLowerCase()} in our directory.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/#directory">
                Browse All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <DirectoryItemCard key={tool.id} item={tool} />
            ))}
          </div>
        </div>

        {/* Recent Guides Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Guides & Insights</h2>
              <p className="text-lg text-muted-foreground">
                Read our expert guides to get the most out of your {siteConfig.categoryName.toLowerCase()}.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/guides">
                View All Guides <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Help Us Improve This {siteConfig.categoryName} Directory</h2>
          <p className="text-lg text-muted-foreground mb-8">
            If you have suggestions for {siteConfig.categoryName.toLowerCase()} we should include, or if you've had experiences (good or bad) with any of the analytics platforms listed here, we'd love to hear from you. This directory is meant to be a community resource, and it gets better with input from people actually using these tools.
          </p>
          <p className="text-lg text-muted-foreground">
            Feel free to reach out if you have questions about specific {siteConfig.categoryName.toLowerCase()} or if you're looking for recommendations for your particular use case. We can't promise we'll have all the answers, but we'll do our best to point you in the right direction.
          </p>
        </div>
      </div>
    </div>
  );
} 