'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface URLSuggestion {
  url: string;
  title: string;
  type: 'tool' | 'category' | 'static';
  similarity: number;
}

/**
 * Dynamic 404 suggestions component that analyzes the requested URL
 * and provides intelligent suggestions based on content similarity
 */
export function NotFoundSuggestions() {
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<URLSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!pathname || pathname === '/') {
        setLoading(false);
        return;
      }

      try {
        // Use the client-safe API to fetch suggestions
        const { fetchURLSuggestions } = await import('@/lib/routing-utils-client');
        const urlSuggestions = await fetchURLSuggestions(pathname);
        setSuggestions(urlSuggestions);
      } catch (error) {
        console.warn('Failed to generate URL suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [pathname]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  const getTypeColor = (type: URLSuggestion['type']) => {
    switch (type) {
      case 'tool':
        return 'bg-blue-100 text-blue-800';
      case 'category':
        return 'bg-green-100 text-green-800';
      case 'static':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: URLSuggestion['type']) => {
    switch (type) {
      case 'tool':
        return 'Tool';
      case 'category':
        return 'Category';
      case 'static':
        return 'Page';
      default:
        return 'Content';
    }
  };

  return (
    <Card className="text-left border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
          <Lightbulb className="w-5 h-5" />
          Did you mean...?
        </CardTitle>
        <CardDescription className="text-blue-600">
          Based on what you were looking for, here are some similar pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <Link 
              key={`${suggestion.url}-${index}`}
              href={suggestion.url}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-100/50 transition-colors group border border-blue-200/50 bg-white"
            >
              <div className="flex items-center gap-3 flex-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getTypeColor(suggestion.type)}`}
                >
                  {getTypeLabel(suggestion.type)}
                </Badge>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-700">
                    {suggestion.title}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {suggestion.url}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {Math.round(suggestion.similarity * 100)}% match
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Additional context for SEO */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> These suggestions are based on content similarity to the URL you requested. 
            Try using our search function or browse categories for more options.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}