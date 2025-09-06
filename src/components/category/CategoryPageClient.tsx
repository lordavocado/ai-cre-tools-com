"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import type { DirectoryItem } from '@/types';
import { siteConfig } from '@/config/site';
import { 
  CheckCircle, Zap, Users, Shield, ArrowRight, Star, 
  TrendingUp, Clock, Target, Workflow, ChevronRight, 
  BarChart3, DollarSign, Award, PieChart
} from 'lucide-react';

interface CategoryPageClientProps {
  category: any;
  categories: any[];
  itemsInCategory: DirectoryItem[];
  itemsLoadError: boolean;
  slug: string;
}

export function CategoryPageClient({ 
  category, 
  categories, 
  itemsInCategory, 
  itemsLoadError, 
  slug 
}: CategoryPageClientProps) {
  // Get top-rated tools for hero section
  const topTools = itemsInCategory
    .filter(item => item.rating && item.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Structured Data for Category */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Tools`,
            description: category.description,
            url: `${siteConfig.url}/categories/${slug}`,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Categories",
                  item: `${siteConfig.url}/categories`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `${siteConfig.url}/categories/${slug}`,
                },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              name: `${category.name} Tools`,
              description: `Curated list of the best ${category.name} tools and software`,
              numberOfItems: itemsInCategory.length,
              itemListElement: itemsInCategory.slice(0, 10).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${siteConfig.url}/${item.slug}`,
                name: item.name,
                description: item.tagline,
              })),
            },
          }),
        }}
      />

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900/20 dark:to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container relative py-20 md:py-32 pl-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            {category.imageUrl && (
              <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src={category.imageUrl} 
                    alt={`${category.name} category icon`}
                    fill 
                    style={{ objectFit: "contain" }}
                    className="p-4"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              {category.name} Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              {category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`}
            </p>
            
            <div className="text-center mb-8">
              <Button
                onClick={scrollToTools}
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Workflow className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {itemsInCategory.length} {itemsInCategory.length === 1 ? 'Tool' : 'Tools'} Available
                </span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Enhanced Top Tools Preview */}
            {topTools.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1 max-w-20"></div>
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Top Rated Tools
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1 max-w-20"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {topTools.map((tool, index) => (
                    <Link 
                      key={tool.slug} 
                      href={`/${tool.slug}`}
                      className="group flex items-center gap-3 px-5 py-3 bg-white/95 dark:bg-slate-800/95 rounded-xl border border-white/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {tool.name}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/30">
                        {tool.rating}★
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Use Cases Section */}
      <div className="container py-20 md:py-28 pl-6 bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Use Cases</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover how {category.name.toLowerCase()} tools transform these critical workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case Cards - Dynamic based on category */}
            {(() => {
              const getCategoryUseCases = (categorySlug: string) => {
                switch (categorySlug) {
                  case 'property-analysis-valuation':
                    return [
                      {
                        icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                        title: 'Automated Property Valuation',
                        description: 'AI-powered valuation models that analyze comparable sales, market trends, and property characteristics to provide instant, accurate property valuations.',
                        benefit: 'Reduce valuation time by 80%'
                      },
                      {
                        icon: <TrendingUp className="h-8 w-8 text-green-600" />,
                        title: 'Market Trend Analysis',
                        description: 'Predictive analytics that identify emerging market trends, price movements, and investment opportunities across different property types and locations.',
                        benefit: 'Forecast accuracy up to 95%'
                      },
                      {
                        icon: <PieChart className="h-8 w-8 text-purple-600" />,
                        title: 'Investment Risk Assessment',
                        description: 'Comprehensive risk analysis combining financial modeling, market volatility, and property-specific factors to optimize investment decisions.',
                        benefit: 'Identify 90% of potential risks'
                      },
                      {
                        icon: <Target className="h-8 w-8 text-orange-600" />,
                        title: 'Comparative Market Analysis',
                        description: 'Advanced algorithms that identify and analyze truly comparable properties, adjusting for differences in location, condition, and market timing.',
                        benefit: 'Find comparable properties in seconds'
                      },
                      {
                        icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
                        title: 'Financial Modeling',
                        description: 'Sophisticated financial models that project cash flows, returns, and scenarios across multiple time horizons with sensitivity analysis.',
                        benefit: 'Model complex scenarios instantly'
                      },
                      {
                        icon: <Workflow className="h-8 w-8 text-indigo-600" />,
                        title: 'Due Diligence Automation',
                        description: 'Automated analysis of property documents, financial records, and market data to streamline the due diligence process.',
                        benefit: 'Complete due diligence 70% faster'
                      }
                    ];
                  case 'property-search-acquisition':
                    return [
                      {
                        icon: <Target className="h-8 w-8 text-blue-600" />,
                        title: 'Intelligent Property Matching',
                        description: 'AI algorithms that match properties to specific investment criteria, preferences, and portfolio requirements.',
                        benefit: 'Find perfect matches in minutes'
                      },
                      {
                        icon: <BarChart3 className="h-8 w-8 text-green-600" />,
                        title: 'Market Opportunity Scanning',
                        description: 'Continuous monitoring of market conditions to identify emerging opportunities and undervalued assets.',
                        benefit: 'Spot opportunities before competitors'
                      },
                      {
                        icon: <Workflow className="h-8 w-8 text-purple-600" />,
                        title: 'Deal Pipeline Management',
                        description: 'Automated systems for tracking prospects, managing offers, and coordinating acquisition processes.',
                        benefit: 'Manage 3x more deals efficiently'
                      }
                    ];
                  default:
                    return [
                      {
                        icon: <Workflow className="h-8 w-8 text-blue-600" />,
                        title: 'Process Automation',
                        description: 'Streamline repetitive tasks and workflows with intelligent automation that learns and adapts to your business processes.',
                        benefit: 'Save 50+ hours per month'
                      },
                      {
                        icon: <BarChart3 className="h-8 w-8 text-green-600" />,
                        title: 'Data-Driven Insights',
                        description: 'Transform raw data into actionable insights with AI-powered analytics and predictive modeling capabilities.',
                        benefit: 'Improve decision accuracy by 40%'
                      },
                      {
                        icon: <Target className="h-8 w-8 text-purple-600" />,
                        title: 'Strategic Optimization',
                        description: 'Optimize operations, investments, and strategic decisions through intelligent analysis and recommendations.',
                        benefit: 'Increase ROI by 25%'
                      }
                    ];
                }
              };
              
              return getCategoryUseCases(slug).map((useCase, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 group-hover:scale-110 transition-transform duration-300">
                        {useCase.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {useCase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {useCase.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <Award className="h-4 w-4" />
                          {useCase.benefit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Enhanced Category Description */}
      {category.longDescription && (
        <div className="container py-20 md:py-28 pl-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">About {category.name} Tools</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full" />
                </div>
                <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: category.longDescription }} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced FAQ Section */}
      <div className="container py-20 md:py-28 pl-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about {category.name.toLowerCase()} tools
            </p>
          </div>
          
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  What are {category.name} tools?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {category.name} tools are specialized AI-powered software solutions designed to help commercial real estate professionals {category.description.toLowerCase()}. These tools leverage artificial intelligence and machine learning to automate processes, provide insights, and improve decision-making in the commercial real estate industry.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  How do I choose the right {category.name} tool?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Consider your specific business needs, budget, team size, and existing technology stack. Look for tools that offer free trials, have strong customer support, and integrate well with your current workflow. Our directory provides detailed comparisons to help you make an informed decision.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Are these {category.name} tools suitable for small businesses?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Many {category.name} tools offer scalable pricing plans suitable for businesses of all sizes. We indicate pricing models and company size recommendations in our directory to help you find solutions that fit your budget and requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  What should I expect in terms of implementation time?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Implementation time varies by tool complexity and business requirements. Simple tools may be ready in days, while comprehensive platforms might take weeks or months. Most vendors provide implementation support and training to ensure successful adoption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Categories Section */}
      <div className="container py-20 pl-6 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Related Categories</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover other AI tools that complement your {category.name.toLowerCase()} solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 4).filter(cat => cat.slug !== slug).map((relatedCategory) => (
              <Link 
                key={relatedCategory.slug} 
                href={`/categories/${relatedCategory.slug}`}
                className="group block"
              >
                <Card className="border-0 shadow-md hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 h-full">
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-500/30 transition-all duration-300">
                      <ArrowRight className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300 leading-snug">
                      {relatedCategory.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* View All Categories Link */}
          <div className="text-center mt-12">
            <Link 
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20 hover:border-primary/30 transition-all duration-300 font-medium text-lg"
            >
              View All Categories
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div id="tools-section" className="container py-20 md:py-28 pl-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">All {category.name} Tools</h2>
            <p className="text-muted-foreground text-lg">
              {itemsInCategory.length > 0 
                ? `Comprehensive directory of ${itemsInCategory.length} ${category.name.toLowerCase()} solutions`
                : `Discover ${category.name.toLowerCase()} solutions for your commercial real estate needs`
              }
            </p>
          </div>
          
          {itemsInCategory.length > 0 ? (
            <DirectoryGrid items={itemsInCategory} />
          ) : (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                {itemsLoadError ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Tools Loading Issue</h3>
                    <p className="text-muted-foreground">
                      We're temporarily unable to load the tools for this category. 
                      Please try again later or explore other categories below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">No Tools Available</h3>
                    <p className="text-muted-foreground">
                      We're constantly adding new {category.name.toLowerCase()} tools to our directory. 
                      Check back soon or explore related categories below.
                    </p>
                  </div>
                )}
                <Link 
                  href="/categories" 
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Tools`,
            description: category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`,
            url: `${siteConfig.url}/categories/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              name: `${category.name} Tools Directory`,
              description: `Directory of ${category.name} AI tools for commercial real estate`,
              numberOfItems: itemsInCategory.length,
              itemListElement: itemsInCategory.map((item, index) => ({
                "@type": "SoftwareApplication",
                position: index + 1,
                name: item.name,
                description: item.tagline,
                url: `${siteConfig.url}/${item.slug}`,
                applicationCategory: category.name,
                operatingSystem: "Web-based",
              }))
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
                  name: "Categories",
                  item: `${siteConfig.url}/categories`
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `${siteConfig.url}/categories/${slug}`
                }
              ]
            }
          })
        }}
      />
    </>
  );
}