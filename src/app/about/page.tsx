import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Building2, TrendingUp, Users, Award, Target, Globe, Mail } from 'lucide-react';
import { AdvancedNewsletterForm } from '@/components/forms/AdvancedNewsletterForm';

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
              logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
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

      <div className="min-h-screen bg-white">
        <div className="container py-16 md:py-24 max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
              About {siteConfig.name}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-6 text-gray-900">
              Revolutionizing Commercial Real Estate Through AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help commercial real estate professionals discover, 
              compare, and implement the most effective AI tools for their business needs.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-serif text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                To democratize access to AI technology in commercial real estate by providing 
                comprehensive, unbiased information about the best tools available.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe every real estate professional should have access to cutting-edge 
                AI tools that can transform their business operations, increase efficiency, 
                and drive better outcomes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-serif text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                To become the definitive resource for commercial real estate AI solutions, 
                fostering innovation and growth across the industry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We envision a future where AI seamlessly integrates into every aspect of 
                commercial real estate, from property valuation to portfolio management, 
                creating unprecedented opportunities for growth and efficiency.
              </p>
            </div>
          </div>

          {/* What We Do */}
          <div className="mb-20">
            <h2 className="text-4xl font-serif text-center mb-12 text-gray-900">What We Do</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-gray-900">Curate AI Tools</h3>
                <p className="text-gray-600 leading-relaxed">
                  We research, evaluate, and catalog the most innovative AI tools specifically 
                  designed for commercial real estate professionals.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-gray-900">Provide Comparisons</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our detailed comparisons help you understand the strengths, weaknesses, 
                  and best use cases for each tool in your specific context.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-gray-900">Build Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  We foster a community of forward-thinking professionals who share insights 
                  and experiences about AI implementation in real estate.
                </p>
              </div>
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-serif text-gray-900">Why Trust {siteConfig.name}?</h2>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our commitment to transparency, accuracy, and unbiased information
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Independent Research
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  We maintain editorial independence and don't accept payment for tool placements. 
                  Our recommendations are based solely on merit and functionality.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Industry Expertise
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Our team combines deep knowledge of commercial real estate with technical 
                  expertise in AI and software evaluation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Continuous Updates
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  The AI landscape evolves rapidly. We continuously monitor new developments 
                  and update our directory to ensure you have access to the latest tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  User-Focused Approach
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Every feature and recommendation is designed with the end user in mind, 
                  helping you make informed decisions that drive real business results.
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 mb-20 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Stay Updated About New CRE AI Tools
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Get the latest insights, tool reviews, and industry updates delivered to your inbox.
              </p>
              <div className="flex justify-center">
                <AdvancedNewsletterForm 
                  source="about-page"
                  title=""
                  description=""
                  availableInterests={[
                    { id: "new-tools", name: "New AI Tools" },
                    { id: "industry-news", name: "Industry News" },
                    { id: "case-studies", name: "Case Studies" },
                    { id: "expert-insights", name: "Expert Insights" }
                  ]}
                  availableTags={["Early Access", "VIP Updates"]}
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-serif mb-6 text-gray-900">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive directory of {siteConfig.categoryName.toLowerCase()} 
              and find the perfect solutions for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Link href="/categories">
                  Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 text-lg">
                <Link href="/#directory">
                  Browse Directory
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

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
              logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
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
          })
        }}
      />
    </>
  );
}