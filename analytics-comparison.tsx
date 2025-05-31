"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, ExternalLink, Plus, X } from "lucide-react"

const analyticsTools = [
  {
    id: "google-analytics",
    icon_link: "🔍",
    name: "Google Analytics",
    one_liner: "Free web analytics service by Google",
    website: "analytics.google.com",
    category: "Web Analytics",
    key_features: ["Real-time data", "Audience insights", "Conversion tracking", "Custom reports"],
    best_for: "Websites, content creators, small to large businesses",
    pricing: "Free / Google Analytics 360: $150k+/year",
    tags: ["Free", "Google", "Web", "Mobile", "E-commerce"],
  },
  {
    id: "mixpanel",
    icon_link: "📊",
    name: "Mixpanel",
    one_liner: "Advanced analytics for mobile and web applications",
    website: "mixpanel.com",
    category: "Product Analytics",
    key_features: ["Event tracking", "Funnel analysis", "Cohort analysis", "A/B testing"],
    best_for: "Mobile apps, SaaS products, product teams",
    pricing: "Free up to 1k MTU / $25+/month",
    tags: ["Product Analytics", "Mobile", "Events", "Funnels"],
  },
  {
    id: "amplitude",
    icon_link: "📈",
    name: "Amplitude",
    one_liner: "Product analytics for digital optimization",
    website: "amplitude.com",
    category: "Product Analytics",
    key_features: ["Behavioral analytics", "User journeys", "Predictive insights", "Experimentation"],
    best_for: "Product managers, growth teams, digital products",
    pricing: "Free up to 10M events / $61+/month",
    tags: ["Behavioral", "Predictive", "Growth", "Enterprise"],
  },
  {
    id: "hotjar",
    icon_link: "🔥",
    name: "Hotjar",
    one_liner: "Heatmaps, recordings, and user feedback tools",
    website: "hotjar.com",
    category: "User Experience",
    key_features: ["Heatmaps", "Session recordings", "User surveys", "Feedback widgets"],
    best_for: "UX designers, conversion optimization, user research",
    pricing: "Free up to 35 sessions/day / $32+/month",
    tags: ["UX", "Heatmaps", "Recordings", "Feedback"],
  },
  {
    id: "posthog",
    icon_link: "🦔",
    name: "PostHog",
    one_liner: "Open-source product analytics platform",
    website: "posthog.com",
    category: "Product Analytics",
    key_features: ["Product analytics", "Session recordings", "Feature flags", "A/B testing"],
    best_for: "Developers, startups, privacy-conscious teams",
    pricing: "Free up to 1M events / $0.00045/event",
    tags: ["Open Source", "Privacy", "All-in-one", "Self-hosted"],
  },
  {
    id: "adobe-analytics",
    icon_link: "🎨",
    name: "Adobe Analytics",
    one_liner: "Enterprise-grade analytics and customer intelligence",
    website: "business.adobe.com/products/analytics",
    category: "Enterprise Analytics",
    key_features: ["Advanced segmentation", "Attribution modeling", "Predictive analytics", "Real-time data"],
    best_for: "Large enterprises, marketing teams, complex analytics needs",
    pricing: "Custom enterprise pricing",
    tags: ["Enterprise", "Marketing", "Attribution", "Adobe"],
  },
  {
    id: "segment",
    icon_link: "🔗",
    name: "Segment",
    one_liner: "Customer data platform for unified data collection",
    website: "segment.com",
    category: "Data Platform",
    key_features: ["Data collection", "Customer profiles", "Real-time streaming", "Integrations"],
    best_for: "Data teams, customer data unification, multi-tool setups",
    pricing: "Free up to 1k MTU / $120+/month",
    tags: ["CDP", "Integrations", "Data", "Real-time"],
  },
  {
    id: "heap",
    icon_link: "📚",
    name: "Heap",
    one_liner: "Automatic event tracking and product analytics",
    website: "heap.io",
    category: "Product Analytics",
    key_features: ["Automatic tracking", "Retroactive analysis", "User journeys", "Conversion funnels"],
    best_for: "Product teams, no-code analytics, retroactive analysis",
    pricing: "Free up to 10k sessions / $3,600+/year",
    tags: ["Automatic", "No-code", "Retroactive", "Product"],
  },
]

const fieldLabels = {
  name: "Tool Name",
  one_liner: "Description",
  website: "Website",
  category: "Category",
  key_features: "Key Features",
  best_for: "Best For",
  pricing: "Pricing",
  tags: "Tags",
}

export default function Component() {
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  const handleToolSelect = (toolId: string, columnIndex: number) => {
    const newSelectedTools = [...selectedTools]
    newSelectedTools[columnIndex] = toolId
    setSelectedTools(newSelectedTools)
  }

  const handleRemoveTool = (columnIndex: number) => {
    const newSelectedTools = [...selectedTools]
    newSelectedTools.splice(columnIndex, 1)
    setSelectedTools(newSelectedTools)
  }

  const handleAddColumn = () => {
    if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, ""])
    }
  }

  const selectedToolsData = selectedTools.map((id) => (id ? analyticsTools.find((tool) => tool.id === id) : null))

  const availableTools = analyticsTools.filter((tool) => !selectedTools.includes(tool.id))

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
                  <th className="text-left p-4 font-semibold text-slate-900 min-w-[200px]">Features</th>
                  {selectedToolsData.map((tool, index) => (
                    <th key={index} className="text-center p-4 min-w-[250px]">
                      <div className="flex flex-col items-center gap-2">
                        {tool ? (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{tool.icon_link}</span>
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
                          <Select onValueChange={(value) => handleToolSelect(value, index)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a tool" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTools.map((tool) => (
                                <SelectItem key={tool.id} value={tool.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{tool.icon_link}</span>
                                    <span>{tool.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </th>
                  ))}
                  {selectedTools.length < 3 && (
                    <th className="text-center p-4 min-w-[200px]">
                      <Button variant="outline" onClick={handleAddColumn} className="flex items-center gap-2">
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
                              <a
                                href={`https://${tool[key as keyof typeof tool]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {tool[key as keyof typeof tool] as string}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : key === "key_features" ? (
                              <div className="space-y-1">
                                {(tool[key as keyof typeof tool] as string[]).map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            ) : key === "tags" ? (
                              <div className="space-y-1">
                                {(tool[key as keyof typeof tool] as string[]).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : key === "category" ? (
                              <Badge variant="default" className="text-xs">
                                {tool[key as keyof typeof tool] as string}
                              </Badge>
                            ) : key === "pricing" ? (
                              <span className="font-semibold text-green-600">
                                {tool[key as keyof typeof tool] as string}
                              </span>
                            ) : (
                              <span className="text-slate-700">{tool[key as keyof typeof tool] as string}</span>
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
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Start comparing analytics tools</h3>
            <p className="text-slate-500">
              Click "Add Tool" in the comparison table above to select and compare up to 3 analytics tools.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
