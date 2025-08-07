import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Building2, TrendingUp, Users, Award, Target, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name} - The Leading ${siteConfig.categoryName} Directory`,
  description: `Learn about ${siteConfig.name}, the premier platform for discovering and comparing ${siteConfig.categoryName.toLowerCase()}. Our mission is to help professionals make informed decisions about AI tools in commercial real estate.`,
  keywords: [
    'about us',
    'commercial real estate AI',
    'proptech directory',
    'ai tools comparison',
    'real estate technology',
    ...siteConfig.seo.primaryKeywords
  ],
  openGraph: {
    title: `About ${siteConfig.name} - Leading ${siteConfig.categoryName} Directory`,
    description: `Discover our mission to revolutionize commercial real estate through AI technology. Learn how ${siteConfig.name} helps professionals find the perfect tools for their needs.`,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.seo.openGraph.siteName,
    images: [
      {
        url: siteConfig.seo.openGraph.images.default,
        width: siteConfig.seo.openGraph.images.width,
        height: siteConfig.seo.openGraph.images.height,
        alt: `About ${siteConfig.name}`,
      },
    ],
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
  twitter: {
    card: siteConfig.seo.twitter.card,
    title: `About ${siteConfig.name}`,
    description: `The leading directory for ${siteConfig.categoryName.toLowerCase()}. Discover, compare, and choose the best AI tools for your commercial real estate needs.`,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${siteConfig.name}`,
            description: siteConfig.description,
            url: `${siteConfig.url}/about`,
            mainEntity: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/product-analytics-tools-logo.png`,
              description: siteConfig.description,
              foundingDate: "2024",
              industry: "PropTech",
              knowsAbout: [
                "Commercial Real Estate AI",
                "Property Technology",
                "AI Tools Directory",
                "Real Estate Analytics",
                "PropTech Solutions"
              ],
              sameAs: Object.values(siteConfig.social || {}).map(handle => 
                handle.includes('@') ? `https://twitter.com/${handle}` : 
                handle.includes('company/') ? `https://linkedin.com/${handle}` :
                `https://github.com/${handle}`
              )
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: `${siteConfig.url}/about`
                }
              ]
            }
          }),
        }}
      />

      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            About {siteConfig.name}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Revolutionizing Commercial Real Estate Through AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to help commercial real estate professionals discover, 
            compare, and implement the most effective AI tools for their business needs.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </div>
              <CardDescription>
                To democratize access to AI technology in commercial real estate by providing 
                comprehensive, unbiased information about the best tools available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe every real estate professional should have access to cutting-edge 
                AI tools that can transform their business operations, increase efficiency, 
                and drive better outcomes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Our Vision</CardTitle>
              </div>
              <CardDescription>
                To become the definitive resource for commercial real estate AI solutions, 
                fostering innovation and growth across the industry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We envision a future where AI seamlessly integrates into every aspect of 
                commercial real estate, from property valuation to portfolio management, 
                creating unprecedented opportunities for growth and efficiency.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Building2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Curate AI Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We research, evaluate, and catalog the most innovative AI tools specifically 
                  designed for commercial real estate professionals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Provide Comparisons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our detailed comparisons help you understand the strengths, weaknesses, 
                  and best use cases for each tool in your specific context.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Build Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We foster a community of forward-thinking professionals who share insights 
                  and experiences about AI implementation in real estate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Trust Us */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <CardTitle>Why Trust {siteConfig.name}?</CardTitle>
            </div>
            <CardDescription>
              Our commitment to transparency, accuracy, and unbiased information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✓ Independent Research</h4>
              <p className="text-muted-foreground">
                We maintain editorial independence and don't accept payment for tool placements. 
                Our recommendations are based solely on merit and functionality.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✓ Industry Expertise</h4>
              <p className="text-muted-foreground">
                Our team combines deep knowledge of commercial real estate with technical 
                expertise in AI and software evaluation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✓ Continuous Updates</h4>
              <p className="text-muted-foreground">
                The AI landscape evolves rapidly. We continuously monitor new developments 
                and update our directory to ensure you have access to the latest tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✓ User-Focused Approach</h4>
              <p className="text-muted-foreground">
                Every feature and recommendation is designed with the end user in mind, 
                helping you make informed decisions that drive real business results.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our comprehensive directory of {siteConfig.categoryName.toLowerCase()} 
            and find the perfect solutions for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/categories">
                Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#directory">
                Browse Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}