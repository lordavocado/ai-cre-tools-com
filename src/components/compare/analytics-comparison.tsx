"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, ExternalLink, Plus, X } from "lucide-react"
import type { DirectoryItem } from "@/types"

// Helper function to get favicon URL from website
const getFaviconUrl = (website: string): string => {
  if (!website) return "/product-analytics-tools-logo.png";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "/product-analytics-tools-logo.png";
  }
};

const fieldLabels = {
  name: "Tool Name",
  tagline: "Description", 
  website: "Website",
  category: "Category",
  pricing: "Pricing",
}

export default function Component() {
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [analyticsTools, setAnalyticsTools] = useState<DirectoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/sheets?type=items');
        const items = await response.json();
        setAnalyticsTools(items);
      } catch (error) {
        console.error("Failed to fetch directory items:", error);
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
  }

  const handleAddColumn = () => {
    if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, ""])
    }
  }

  const selectedToolsData = selectedTools.map((id) => (id ? analyticsTools.find((tool: DirectoryItem) => tool.id === id) : null))

  const availableTools = analyticsTools.filter((tool: DirectoryItem) => !selectedTools.includes(tool.id))

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
                                <img 
                                  src={tool.imageUrl || getFaviconUrl(tool.website)} 
                                  alt={tool.name} 
                                  className="w-6 h-6 rounded object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getFaviconUrl(tool.website);
                                  }}
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
                          <Select onValueChange={(value) => handleToolSelect(value, index)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a tool" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTools.map((tool) => (
                                <SelectItem key={tool.id} value={tool.id}>
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={tool.imageUrl || getFaviconUrl(tool.website)} 
                                      alt={tool.name} 
                                      className="w-4 h-4 rounded object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = getFaviconUrl(tool.website);
                                      }}
                                    />
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
                                href={tool.website.startsWith('http') ? tool.website : `https://${tool.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {tool.website}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : key === "category" ? (
                              <Badge variant="default" className="text-xs">
                                {tool.category}
                              </Badge>
                            ) : key === "pricing" ? (
                              <span className="font-semibold text-green-600">
                                {tool.pricing || 'Contact for pricing'}
                              </span>
                            ) : key === "name" ? (
                              <span className="text-slate-700 font-medium">{tool.name}</span>
                            ) : key === "tagline" ? (
                              <span className="text-slate-700">{tool.tagline}</span>
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
          <div className="text-center text-slate-500 py-8">
            Select tools above to compare them
          </div>
        )}
      </div>
    </div>
  )
}
