"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BarChart3, ExternalLink, Plus, X, Check, ChevronsUpDown } from "lucide-react"
import type { DirectoryItem } from "@/types"
import { getImageUrl, getFaviconUrl } from "@/lib/image-utils"
import { SafeImage } from "@/components/ui/safe-image"

// Category slug to display name mapping
const categoryDisplayNames: Record<string, string> = {
  'event-tracking': 'Event Tracking',
  'session-replay': 'Session Replay',
  'funnel-analytics': 'Funnel Analytics',
  'cohort-analysis': 'Cohort Analysis',
  'ab-testing': 'A/B Testing',
  'heatmap-analysis': 'Heatmap Analysis',
  'user-segmentation': 'User Segmentation',
  'real-time-analytics': 'Real-time Analytics',
  'conversion-optimization': 'Conversion Optimization',
  'behavioral-analytics': 'Behavioral Analytics',
  'retention-analytics': 'Retention Analytics',
  'revenue-analytics': 'Revenue Analytics',
  'attribution-modeling': 'Attribution Modeling',
  'customer-journey': 'Customer Journey',
  'predictive-analytics': 'Predictive Analytics',
  'data-visualization': 'Data Visualization',
  'web-analytics': 'Web Analytics',
  'mobile-analytics': 'Mobile Analytics',
  'product-analytics': 'Product Analytics',
  'marketing-analytics': 'Marketing Analytics',
  'enterprise-analytics': 'Enterprise Analytics',
  'free-tools': 'Free Tools',
  'open-source': 'Open Source',
  'saas-analytics': 'SaaS Analytics',
  'ecommerce-analytics': 'E-commerce Analytics'
};

// Helper function to get category display name
const getCategoryDisplayName = (slug: string): string => {
  return categoryDisplayNames[slug.toLowerCase().trim()] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
};

const fieldLabels = {
  name: "Tool Name",
  tagline: "One-liner",
  description: "Description", 
  website: "Website",
  category: "Category",
  features: "Key Features",
  tags: "Tags",
  bestFor: "Best For",
  pricing: "Pricing",
}

export default function Component() {
  const [selectedTools, setSelectedTools] = useState<string[]>([""])
  const [analyticsTools, setAnalyticsTools] = useState<DirectoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([false])

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/sheets?type=items');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const items = await response.json();
        
        if (items.error) {
          throw new Error(items.error);
        }
        
        setAnalyticsTools(items);
      } catch (error) {
        console.error("Failed to fetch directory items:", error);
        setError(error instanceof Error ? error.message : "Failed to load tools");
        // Set some fallback data so the component still works
        setAnalyticsTools([
          {
            id: "google-analytics",
            name: "Google Analytics",
            tagline: "Free web analytics service by Google",
            website: "analytics.google.com",
            category: "web-analytics,free-tools",
            pricing: "Free / GA360: $150k+/year",
            imageUrl: "",
            slug: "google-analytics",
            description: "Google Analytics gives you the tools you need to better understand your customers. You can then use those business insights to take action, such as improving your website, creating tailored audience lists, and more.",
            features: [
              { name: "Real-time tracking" },
              { name: "Custom reports" },
              { name: "Conversion tracking" }
            ],
            bestFor: "Websites, content creators, small to large businesses",
            tags: ["Free", "Google", "Web Analytics"],
            rating: 4.2
          },
          {
            id: "mixpanel",
            name: "Mixpanel",
            tagline: "Advanced analytics for mobile and web applications",
            website: "mixpanel.com",
            category: "product-analytics,event-tracking",
            pricing: "Free up to 1k MTU / $25+/month",
            imageUrl: "",
            slug: "mixpanel",
            description: "Mixpanel helps companies build better products through data. With our powerful, self-serve product analytics solution, teams can easily analyze how and why people engage, convert, and retain to improve their user experience.",
            features: [
              { name: "Event tracking" },
              { name: "Funnel analysis" },
              { name: "Cohort analysis" }
            ],
            bestFor: "Mobile apps, SaaS products, product teams",
            tags: ["Product Analytics", "Mobile", "Events"],
            rating: 4.5
          },
          {
            id: "amplitude",
            name: "Amplitude",
            tagline: "Product analytics for digital optimization",
            website: "amplitude.com",
            category: "product-analytics,behavioral-analytics",
            pricing: "Free up to 10M events / $61+/month",
            imageUrl: "",
            slug: "amplitude",
            description: "Amplitude is a leading digital analytics platform that helps companies unlock the power of their products. More than 2,600 customers, including Atlassian, Jersey Mike's, NBCUniversal, Shopify, and Under Armour, rely on Amplitude to gain self-service visibility into the entire customer journey.",
            features: [
              { name: "Behavioral analytics" },
              { name: "User journeys" },
              { name: "Predictive insights" }
            ],
            bestFor: "Product managers, growth teams, digital products",
            tags: ["Behavioral", "Predictive", "Enterprise"],
            rating: 4.4
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToolSelect = (toolId: string, columnIndex: number) => {
    const newSelectedTools = [...selectedTools]
    newSelectedTools[columnIndex] = toolId
    setSelectedTools(newSelectedTools)
  }

  const handleRemoveTool = (columnIndex: number) => {
    const newSelectedTools = [...selectedTools]
    newSelectedTools.splice(columnIndex, 1)
    setSelectedTools(newSelectedTools)
    
    // Also update openDropdowns to match the new length
    const newOpenDropdowns = [...openDropdowns];
    if (newOpenDropdowns.length > newSelectedTools.length) {
      newOpenDropdowns.splice(columnIndex, 1);
    }
    setOpenDropdowns(newOpenDropdowns);
  }

  const handleAddColumn = () => {
    if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, ""])
      // Also update openDropdowns to match the new length
      const newOpenDropdowns = [...openDropdowns];
      if (newOpenDropdowns.length <= selectedTools.length) {
        newOpenDropdowns.push(false);
      }
      setOpenDropdowns(newOpenDropdowns);
    }
  }

  const selectedToolsData = selectedTools.map((id) => (id ? analyticsTools.find((tool: DirectoryItem) => tool.id === id) : null))

  const availableTools = analyticsTools.filter((tool: DirectoryItem) => !selectedTools.includes(tool.id))
  
  // Debug logging
  console.log('Current state:', { selectedTools, openDropdowns, availableToolsCount: availableTools.length })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Product Analytics Tools Comparison</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Loading tools...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && analyticsTools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Product Analytics Tools Comparison</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tools</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Product Analytics Tools Comparison</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Compare the best product analytics tools side by side. Select up to 3 tools to see detailed feature
            comparisons, pricing, and specifications.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Using demo data. {error}
              </p>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-slate-50 border-b">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Feature Comparison
            </h2>
            <p className="text-slate-600 mt-1">Select tools to compare their features, pricing, and capabilities</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-900 min-w-[200px]">Tool</th>
                  {selectedToolsData.map((tool, index) => (
                    <th key={index} className="text-center p-4 min-w-[250px]">
                      <div className="flex flex-col items-center gap-2">
                        {tool ? (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <SafeImage
                                  src={tool.imageUrl}
                                  alt={tool.name}
                                  website={tool.website}
                                  className="w-6 h-6 rounded object-cover"
                                  fallbackText={tool.name.charAt(0)}
                                />
                                <span className="font-semibold text-slate-900">{tool.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTool(index)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Popover 
                            open={openDropdowns[index]} 
                            onOpenChange={(open) => {
                              const newOpenDropdowns = [...openDropdowns];
                              newOpenDropdowns[index] = open;
                              setOpenDropdowns(newOpenDropdowns);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openDropdowns[index]}
                                className="w-full justify-between"
                              >
                                Select a tool...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput placeholder="Search tools..." />
                                <CommandList>
                                  <CommandEmpty>No tool found.</CommandEmpty>
                                  <CommandGroup>
                                    {availableTools.map((tool) => (
                                      <CommandItem
                                        key={tool.id}
                                        value={tool.name}
                                        onSelect={() => {
                                          handleToolSelect(tool.id, index);
                                          const newOpenDropdowns = [...openDropdowns];
                                          newOpenDropdowns[index] = false;
                                          setOpenDropdowns(newOpenDropdowns);
                                        }}
                                        className="cursor-pointer hover:bg-slate-100"
                                      >
                                        <SafeImage
                                          src={tool.imageUrl}
                                          alt={tool.name}
                                          website={tool.website}
                                          className="w-4 h-4 rounded object-cover mr-2"
                                          fallbackText={tool.name.charAt(0)}
                                        />
                                        <span>{tool.name}</span>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </th>
                  ))}
                  {selectedTools.length < 3 && (
                    <th className="text-center p-4 min-w-[200px]">
                      <Button 
                        variant="outline" 
                        onClick={handleAddColumn} 
                        className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tool
                      </Button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(fieldLabels).map(([key, label]) => (
                  <tr key={key} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-700 bg-slate-50">{label}</td>
                    {selectedToolsData.map((tool, index) => (
                      <td key={index} className="p-4 align-top">
                        {tool ? (
                          <div className="text-sm">
                            {key === "website" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(tool.website.startsWith('http') ? tool.website : `https://${tool.website}`, '_blank')}
                                className="flex items-center gap-2 text-xs h-8"
                              >
                                Website
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            ) : key === "category" ? (
                              <div className="space-y-1">
                                {tool.category?.split(',').map((cat, idx) => (
                                  <Badge key={idx} variant="default" className="mr-1 mb-1 text-xs">
                                    {getCategoryDisplayName(cat.trim())}
                                  </Badge>
                                ))}
                              </div>
                            ) : key === "features" ? (
                              <div className="space-y-1">
                                {tool.features && tool.features.length > 0 ? (
                                  tool.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                                      {feature.name}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-slate-500 text-xs italic">No features listed</span>
                                )}
                              </div>
                            ) : key === "tags" ? (
                              <div className="space-y-1">
                                {tool.tags && tool.tags.length > 0 ? (
                                  // Handle both array and comma-separated string formats
                                  tool.tags.map((tag: any, idx: number) => (
                                    <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                                      {tag.trim ? tag.trim() : tag}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-slate-500 text-xs italic">No tags</span>
                                )}
                              </div>
                            ) : key === "bestFor" ? (
                              <span className="text-slate-700 text-sm">{tool.bestFor || '-'}</span>
                            ) : key === "pricing" ? (
                              <span className="font-semibold text-green-600">
                                {tool.pricing || 'Contact for pricing'}
                              </span>
                            ) : key === "name" ? (
                              <span className="text-slate-700 font-medium">{tool.name}</span>
                            ) : key === "tagline" ? (
                              <span className="text-slate-700">{tool.tagline}</span>
                            ) : key === "description" ? (
                              <span className="text-slate-700 text-sm">{tool.description || '-'}</span>
                            ) : (
                              <span className="text-slate-700">-</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-400 text-sm italic">Select a tool above</div>
                        )}
                      </td>
                    ))}
                    {selectedTools.length < 3 && <td className="p-4"></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedToolsData.filter(Boolean).length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-slate-700 mb-2">Ready to Compare Tools?</h3>
              <p className="text-slate-500">Click "Add Tool" above to select analytics tools and see their detailed comparison</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
