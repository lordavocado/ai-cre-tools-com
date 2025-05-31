if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import type { DirectoryItem, Category } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Activity, Play, TrendingUp, Users, RotateCcw, TestTube, DollarSign, Brain, MessageSquare, type LucideIcon } from 'lucide-react';
import type React from 'react';

// --- Configuration ---

// 1. Sheet Names Configuration:
const SHEET_NAMES = {
  ITEMS: 'productanalyticstools',
  NEWSLETTER: 'Newsletter',
};

// 2. Column Name Mappings Configuration:
const COLUMN_MAPPINGS = {
  ITEMS: {
    ID: 'id',
    SLUG: 'id', // Using id as slug since there's no dedicated slug column
    NAME: 'name',
    TAGLINE: 'one_liner',
    DESCRIPTION: 'description',
    CATEGORY_SLUG: 'category',
    WEBSITE: 'website',
    IMAGE_URL: 'icon_link',
    FEATURES_JSON: 'key_features', // Expects: [{"name": "Feature 1", "description": "Optional desc"}, {"name": "Feature 2"}]
    PRICING: 'pricing',
    BEST_FOR: 'best_for',
    TAGS: 'tags',
    RATING: 'rating',
  },
  NEWSLETTER: {
    EMAIL: 'Email',
    TIMESTAMP: 'Timestamp',
  },
};

// --- End Configuration ---

const lucideIconMap: { [key: string]: LucideIcon } = {
  Activity, Play, TrendingUp, Users, RotateCcw, TestTube, DollarSign, Brain, MessageSquare,
};

// Hardcoded categories
const HARDCODED_CATEGORIES: Category[] = [
  {
    id: 'event-tracking',
    slug: 'event-tracking',
    name: 'Event Tracking',
    description: 'Basic behavioral data collection and monitoring',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is Event Tracking?</h3>
          <p class="text-foreground mb-4">Event tracking is the foundation of modern analytics, capturing every meaningful user interaction across your digital platforms. From clicks and page views to form submissions and purchases, event tracking provides the raw data that powers all other analytics capabilities.</p>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Key Value Propositions</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong class="text-foreground">Complete User Journey Visibility:</strong> See every step users take through your product</li>
            <li><strong class="text-foreground">Data-Driven Decision Making:</strong> Base product decisions on actual user behavior, not assumptions</li>
            <li><strong class="text-foreground">Performance Optimization:</strong> Identify bottlenecks and optimization opportunities</li>
            <li><strong class="text-foreground">Cross-Platform Insights:</strong> Unified tracking across web, mobile, and other touchpoints</li>
            <li><strong class="text-foreground">Real-Time Monitoring:</strong> Immediate alerts when user behavior patterns change</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Perfect For These Companies</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">E-commerce Platforms</h4>
              <p class="text-sm text-blue-800 dark:text-blue-200">Track product views, cart additions, checkout steps, and purchase completions to optimize conversion funnels.</p>
            </div>
            <div class="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">SaaS Applications</h4>
              <p class="text-sm text-green-800 dark:text-green-200">Monitor feature usage, user onboarding progress, and subscription events to improve product adoption.</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Content Platforms</h4>
              <p class="text-sm text-purple-800 dark:text-purple-200">Understand content engagement, reading patterns, and user preferences to optimize content strategy.</p>
            </div>
            <div class="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 class="font-semibold text-orange-900 dark:text-orange-100 mb-2">Mobile Apps</h4>
              <p class="text-sm text-orange-800 dark:text-orange-200">Track app launches, screen views, in-app purchases, and user interactions to improve user experience.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">How to Get Started</h3>
          <ol class="list-decimal list-inside space-y-2 text-muted-foreground">
            <li><strong class="text-foreground">Define key business events</strong> (signups, purchases, feature usage)</li>
            <li><strong class="text-foreground">Choose a tracking platform</strong> that fits your technical requirements</li>
            <li><strong class="text-foreground">Implement tracking code</strong> across all relevant touchpoints</li>
            <li><strong class="text-foreground">Set up custom events</strong> for business-specific actions</li>
            <li><strong class="text-foreground">Create dashboards</strong> to monitor your most important metrics</li>
            <li><strong class="text-foreground">Establish review processes</strong> to act on insights regularly</li>
          </ol>
        </div>
      </div>
    `,
    imageUrl: '/event-tracking.png',
    itemCount: 0, // Will be calculated dynamically
    icon: Activity,
  },
  {
    id: 'session-replay',
    slug: 'session-replay',
    name: 'Session Replay',
    description: 'Visual analysis through recordings and heatmaps',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is Session Replay?</h3>
          <p class="text-foreground mb-4">Session replay technology captures and recreates actual user sessions, showing you exactly how users navigate, interact, and experience your product. Unlike traditional analytics that show you what happened, session replay shows you how it happened.</p>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Key Value Propositions</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong class="text-foreground">Visual Bug Detection:</strong> See exactly where users encounter issues or get stuck</li>
            <li><strong class="text-foreground">UX Optimization:</strong> Understand user frustrations and friction points in real-time</li>
            <li><strong class="text-foreground">Conversion Analysis:</strong> Watch successful vs. failed conversion attempts</li>
            <li><strong class="text-foreground">Customer Support:</strong> Quickly understand and resolve user issues</li>
            <li><strong class="text-foreground">Heat Map Insights:</strong> See where users click, scroll, and focus attention</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Perfect For These Industries</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 class="font-semibold text-red-900 dark:text-red-100 mb-2">Financial Services</h4>
              <p class="text-sm text-red-800 dark:text-red-200">Ensure smooth application processes and identify security concerns in user behavior patterns.</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">E-commerce Sites</h4>
              <p class="text-sm text-blue-800 dark:text-blue-200">Optimize checkout flows and product discovery by watching real user interactions.</p>
            </div>
            <div class="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">SaaS Platforms</h4>
              <p class="text-sm text-indigo-800 dark:text-indigo-200">Improve user onboarding and feature adoption by seeing where users struggle.</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 class="font-semibold text-teal-900 dark:text-teal-100 mb-2">Healthcare Apps</h4>
              <p class="text-sm text-teal-800 dark:text-teal-200">Ensure critical workflows function smoothly and patients can easily access services.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Implementation Strategy</h3>
          <div class="bg-muted/50 p-4 rounded-lg">
            <ol class="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><strong class="text-foreground">Start with high-value pages</strong> (checkout, signup, key features)</li>
              <li><strong class="text-foreground">Set up privacy controls</strong> to exclude sensitive data</li>
              <li><strong class="text-foreground">Create automated alerts</strong> for rage clicks and errors</li>
              <li><strong class="text-foreground">Establish review workflows</strong> with your UX and development teams</li>
              <li><strong class="text-foreground">Use insights to prioritize</strong> UX improvements and bug fixes</li>
            </ol>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/session-replay.png',
    itemCount: 0,
    icon: Play,
  },
  {
    id: 'funnel-analytics',
    slug: 'funnel-analytics',
    name: 'Funnel Analytics',
    description: 'Conversion optimization and drop-off analysis',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is Funnel Analytics?</h3>
          <p class="text-foreground mb-4">Funnel analytics tracks users through multi-step processes, revealing exactly where potential customers drop off and why conversions fail. It's essential for understanding and optimizing any sequential user journey that drives business value.</p>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Business Impact</h3>
          <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p class="text-sm text-foreground mb-2"><strong>ROI Focus:</strong> Every percentage point improvement in conversion can significantly impact revenue</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              <li>Identify the highest-impact optimization opportunities</li>
              <li>Reduce customer acquisition costs by improving existing traffic</li>
              <li>Increase lifetime value through better onboarding flows</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Critical Use Cases</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 class="font-semibold text-amber-900 dark:text-amber-100 mb-2">E-commerce</h4>
              <p class="text-sm text-amber-800 dark:text-amber-200">Product discovery → Cart → Checkout → Purchase</p>
            </div>
            <div class="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
              <h4 class="font-semibold text-violet-900 dark:text-violet-100 mb-2">SaaS Signup</h4>
              <p class="text-sm text-violet-800 dark:text-violet-200">Landing → Trial → Onboarding → Paid Conversion</p>
            </div>
            <div class="bg-cyan-50 dark:bg-cyan-950/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 class="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Lead Generation</h4>
              <p class="text-sm text-cyan-800 dark:text-cyan-200">Ad Click → Landing Page → Form → Qualified Lead</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Optimization Framework</h3>
          <div class="space-y-3">
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">1. Measure Baseline</h4>
              <p class="text-sm text-muted-foreground">Establish current conversion rates for each funnel step</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">2. Identify Drop-off Points</h4>
              <p class="text-sm text-muted-foreground">Focus on steps with the highest abandonment rates</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">3. Hypothesis Testing</h4>
              <p class="text-sm text-muted-foreground">Test improvements with A/B experiments</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">4. Continuous Monitoring</h4>
              <p class="text-sm text-muted-foreground">Track performance and iterate based on results</p>
            </div>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/funnel-analytics.png',
    itemCount: 0,
    icon: TrendingUp,
  },
  {
    id: 'user-segmentation',
    slug: 'user-segmentation',
    name: 'User Segmentation',
    description: 'Grouping users for targeted insights',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is User Segmentation?</h3>
          <p class="text-foreground mb-4">User segmentation divides your audience into distinct groups based on shared characteristics, behaviors, or needs. This enables personalized experiences, targeted marketing, and more relevant product development decisions.</p>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Segmentation Strategies</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 class="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Behavioral Segmentation</h4>
              <ul class="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                <li>• Feature usage patterns</li>
                <li>• Purchase frequency</li>
                <li>• Engagement levels</li>
                <li>• User journey stages</li>
              </ul>
            </div>
            <div class="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
              <h4 class="font-semibold text-rose-900 dark:text-rose-100 mb-2">Demographic Segmentation</h4>
              <ul class="text-sm text-rose-800 dark:text-rose-200 space-y-1">
                <li>• Geographic location</li>
                <li>• Company size (B2B)</li>
                <li>• Industry vertical</li>
                <li>• Device preferences</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Business Applications</h3>
          <div class="space-y-4">
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Personalization at Scale</h4>
              <p class="text-sm text-purple-800 dark:text-purple-200">Deliver tailored experiences to different user groups without manual intervention. Increase engagement and conversion rates through relevant content and features.</p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Product Development</h4>
              <p class="text-sm text-blue-800 dark:text-blue-200">Understand which features resonate with different user types. Prioritize development based on segment value and needs.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Implementation Roadmap</h3>
          <div class="bg-muted/50 p-4 rounded-lg">
            <ol class="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><strong class="text-foreground">Data Collection:</strong> Ensure you're tracking relevant user attributes and behaviors</li>
              <li><strong class="text-foreground">Segment Definition:</strong> Create meaningful, actionable segments based on business goals</li>
              <li><strong class="text-foreground">Validation:</strong> Test segment performance and refine criteria</li>
              <li><strong class="text-foreground">Activation:</strong> Use segments for targeted campaigns and product decisions</li>
              <li><strong class="text-foreground">Monitoring:</strong> Track segment performance and evolution over time</li>
            </ol>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/user-segmentation.png',
    itemCount: 0,
    icon: Users,
  },
  {
    id: 'retention-analytics',
    slug: 'retention-analytics',
    name: 'Retention Analytics',
    description: 'Long-term engagement and churn prevention',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is Retention Analytics?</h3>
          <p class="text-foreground mb-4">Retention analytics focuses on keeping users engaged over time, measuring loyalty, and preventing churn. It's often more cost-effective to retain existing users than acquire new ones, making retention a critical business metric.</p>
        </div>
        
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
          <h4 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">💡 Key Insight</h4>
          <p class="text-sm text-yellow-800 dark:text-yellow-200">A 5% increase in customer retention can increase profits by 25-95%. Retention analytics helps you identify and fix leaky buckets in your user experience.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Essential Metrics</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 class="font-semibold text-green-900 dark:text-green-100 text-sm">Cohort Retention Rates</h4>
                <p class="text-xs text-green-800 dark:text-green-200">Track how different user groups behave over time</p>
              </div>
              <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 text-sm">Churn Prediction</h4>
                <p class="text-xs text-blue-800 dark:text-blue-200">Identify at-risk users before they leave</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 class="font-semibold text-purple-900 dark:text-purple-100 text-sm">Feature Stickiness</h4>
                <p class="text-xs text-purple-800 dark:text-purple-200">Measure which features drive long-term usage</p>
              </div>
              <div class="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 text-sm">Lifecycle Value</h4>
                <p class="text-xs text-indigo-800 dark:text-indigo-200">Calculate long-term user worth</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">High-Impact Industries</h3>
          <div class="grid md:grid-cols-3 gap-3">
            <div class="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
              <h4 class="font-semibold text-pink-900 dark:text-pink-100 text-sm">Subscription Services</h4>
              <p class="text-xs text-pink-800 dark:text-pink-200">Reduce monthly/annual churn</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg border border-teal-200 dark:border-teal-800 text-center">
              <h4 class="font-semibold text-teal-900 dark:text-teal-100 text-sm">Mobile Apps</h4>
              <p class="text-xs text-teal-800 dark:text-teal-200">Improve daily/weekly active users</p>
            </div>
            <div class="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg border border-orange-200 dark:border-orange-800 text-center">
              <h4 class="font-semibold text-orange-900 dark:text-orange-100 text-sm">E-commerce</h4>
              <p class="text-xs text-orange-800 dark:text-orange-200">Build repeat customer base</p>
            </div>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/retention-analytics.png',
    itemCount: 0,
    icon: RotateCcw,
  },
  {
    id: 'ab-testing',
    slug: 'ab-testing',
    name: 'A/B Testing',
    description: 'Experimentation and optimization testing',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is A/B Testing?</h3>
          <p class="text-foreground mb-4">A/B testing allows you to scientifically test different versions of your product to see which performs better. It's the gold standard for making data-driven decisions and optimizing user experiences.</p>
        </div>
        
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">🧪 Scientific Approach</h4>
          <p class="text-sm text-green-800 dark:text-green-200">Move beyond opinions and hunches. A/B testing provides statistical confidence in your product decisions, reducing risk and maximizing impact.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Testing Opportunities</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <h4 class="font-semibold text-foreground">UI/UX Elements</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Button colors and copy</li>
                <li>• Page layouts and flows</li>
                <li>• Form designs</li>
                <li>• Navigation structures</li>
              </ul>
            </div>
            <div class="space-y-2">
              <h4 class="font-semibold text-foreground">Business Logic</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Pricing strategies</li>
                <li>• Feature rollouts</li>
                <li>• Recommendation algorithms</li>
                <li>• Onboarding flows</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Success Framework</h3>
          <div class="space-y-2">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <h4 class="font-semibold text-foreground">Hypothesis Formation</h4>
                <p class="text-sm text-muted-foreground">Create clear, testable hypotheses with predicted outcomes</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <h4 class="font-semibold text-foreground">Test Design</h4>
                <p class="text-sm text-muted-foreground">Plan sample sizes, duration, and success metrics</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <h4 class="font-semibold text-foreground">Statistical Analysis</h4>
                <p class="text-sm text-muted-foreground">Ensure results reach statistical significance before acting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/a-b-testing.png',
    itemCount: 0,
    icon: TestTube,
  },
  {
    id: 'revenue-analytics',
    slug: 'revenue-analytics',
    name: 'Revenue Analytics',
    description: 'Business outcome tracking and attribution',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is Revenue Analytics?</h3>
          <p class="text-foreground mb-4">Revenue analytics connects user behavior directly to business outcomes, helping you understand which actions, features, and campaigns actually drive revenue growth and profitability.</p>
        </div>
        
        <div class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h4 class="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">💰 Business Impact</h4>
          <p class="text-sm text-emerald-800 dark:text-emerald-200">Revenue analytics is the bridge between user actions and business results. It answers the critical question: "Which of our efforts actually make money?"</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Key Revenue Metrics</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Attribution Models</h4>
              <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• First-touch attribution</li>
                <li>• Last-touch attribution</li>
                <li>• Multi-touch attribution</li>
                <li>• Time-decay models</li>
              </ul>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Revenue Tracking</h4>
              <ul class="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• Customer lifetime value</li>
                <li>• Revenue per user</li>
                <li>• Conversion value</li>
                <li>• Subscription metrics</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Industry Applications</h3>
          <div class="grid md:grid-cols-3 gap-3">
            <div class="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
              <h4 class="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">E-commerce</h4>
              <p class="text-xs text-yellow-800 dark:text-yellow-200">Track purchase attribution and customer value</p>
            </div>
            <div class="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center">
              <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 text-sm">SaaS</h4>
              <p class="text-xs text-indigo-800 dark:text-indigo-200">Monitor subscription conversions and upgrades</p>
            </div>
            <div class="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-800 text-center">
              <h4 class="font-semibold text-rose-900 dark:text-rose-100 text-sm">Lead Gen</h4>
              <p class="text-xs text-rose-800 dark:text-rose-200">Calculate qualified lead value and ROI</p>
            </div>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/revenue-analytics.png',
    itemCount: 0,
    icon: DollarSign,
  },

  {
    id: 'ai-insights',
    slug: 'ai-insights',
    name: 'AI Insights',
    description: 'Machine learning and predictive analytics',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What are AI Insights?</h3>
          <p class="text-foreground mb-4">AI-powered analytics automatically discovers patterns, predicts future behavior, and surfaces insights that humans might miss. It's like having a data scientist working 24/7 on your analytics.</p>
        </div>
        
        <div class="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
          <h4 class="font-semibold text-violet-900 dark:text-violet-100 mb-2">🤖 AI Capabilities</h4>
          <p class="text-sm text-violet-800 dark:text-violet-200">Modern AI can process vast amounts of data to identify trends, anomalies, and opportunities faster and more accurately than traditional analytics methods.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">AI-Powered Features</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <h4 class="font-semibold text-cyan-900 dark:text-cyan-100 text-sm">Predictive Analytics</h4>
                <p class="text-xs text-cyan-800 dark:text-cyan-200">Forecast user behavior and business outcomes</p>
              </div>
              <div class="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 class="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">Anomaly Detection</h4>
                <p class="text-xs text-emerald-800 dark:text-emerald-200">Automatically spot unusual patterns or issues</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 class="font-semibold text-orange-900 dark:text-orange-100 text-sm">Natural Language Queries</h4>
                <p class="text-xs text-orange-800 dark:text-orange-200">Ask questions in plain English, get instant answers</p>
              </div>
              <div class="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
                <h4 class="font-semibold text-pink-900 dark:text-pink-100 text-sm">Automated Insights</h4>
                <p class="text-xs text-pink-800 dark:text-pink-200">Receive proactive alerts about important changes</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Perfect for Data-Driven Teams</h3>
          <div class="bg-muted/50 p-4 rounded-lg">
            <p class="text-sm text-muted-foreground mb-3">AI insights are especially valuable for teams that:</p>
            <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Need to process large volumes of complex data</li>
              <li>Want to predict and prevent user churn</li>
              <li>Require real-time anomaly detection</li>
              <li>Seek competitive advantages through advanced analytics</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/ai-insights.png',
    itemCount: 0,
    icon: Brain,
  },
  {
    id: 'user-feedback',
    slug: 'user-feedback',
    name: 'User Feedback',
    description: 'Qualitative data collection and sentiment',
    longDescription: `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">What is User Feedback Analytics?</h3>
          <p class="text-foreground mb-4">User feedback analytics combines quantitative behavioral data with qualitative user input to provide a complete picture of user experience, satisfaction, and needs.</p>
        </div>
        
        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
          <h4 class="font-semibold text-teal-900 dark:text-teal-100 mb-2">💬 The Voice of Your Users</h4>
          <p class="text-sm text-teal-800 dark:text-teal-200">While analytics tell you what users do, feedback tells you why they do it. This combination is powerful for product improvement and user satisfaction.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Feedback Collection Methods</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 text-sm">In-App Surveys</h4>
                <p class="text-xs text-blue-800 dark:text-blue-200">Contextual feedback at key moments</p>
              </div>
              <div class="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 class="font-semibold text-green-900 dark:text-green-100 text-sm">NPS Tracking</h4>
                <p class="text-xs text-green-800 dark:text-green-200">Measure customer loyalty and satisfaction</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 class="font-semibold text-purple-900 dark:text-purple-100 text-sm">Sentiment Analysis</h4>
                <p class="text-xs text-purple-800 dark:text-purple-200">Analyze emotions in user communications</p>
              </div>
              <div class="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 class="font-semibold text-amber-900 dark:text-amber-100 text-sm">Feature Requests</h4>
                <p class="text-xs text-amber-800 dark:text-amber-200">Prioritize development based on user needs</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-primary">Strategic Implementation</h3>
          <div class="space-y-3">
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">Moment-Based Collection</h4>
              <p class="text-sm text-muted-foreground">Trigger surveys after specific user actions or milestones</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">Feedback Loop Closure</h4>
              <p class="text-sm text-muted-foreground">Show users how their feedback influences product improvements</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-foreground">Cross-Team Integration</h4>
              <p class="text-sm text-muted-foreground">Share insights with product, support, and marketing teams</p>
            </div>
          </div>
        </div>
      </div>
    `,
    imageUrl: '/user-feedback.png',
    itemCount: 0,
    icon: MessageSquare,
  }
];

let docInstance: GoogleSpreadsheet | null = null;
let docInfoLoaded: boolean = false;

// Cache for environment variables to avoid repeated lookups if they were initially found
let cachedSheetId: string | null = null;
let cachedServiceAccountEmail: string | null = null;
let cachedPrivateKey: string | null = null;

// Enhanced caching with timestamps
let allItemsCache: DirectoryItem[] | null = null;
let allItemsCacheTimestamp: number = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting
let lastRequestTime: number = 0;
const MIN_REQUEST_INTERVAL_MS = 1000; // Minimum 1 second between requests
let requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

// Pending requests to prevent duplicate calls
let pendingDocInitialization: Promise<GoogleSpreadsheet> | null = null;
let pendingItemsRequest: Promise<DirectoryItem[]> | null = null;

// Circuit breaker for rate limiting
let circuitBreakerOpenUntil: number = 0;
let consecutiveFailures: number = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
const CIRCUIT_BREAKER_TIMEOUT_MS = 60 * 1000; // 1 minute

// Circuit breaker utilities
function isCircuitBreakerOpen(): boolean {
  return Date.now() < circuitBreakerOpenUntil;
}

function openCircuitBreaker(): void {
  circuitBreakerOpenUntil = Date.now() + CIRCUIT_BREAKER_TIMEOUT_MS;
  console.warn(`Circuit breaker opened due to ${consecutiveFailures} consecutive failures. Will retry after ${CIRCUIT_BREAKER_TIMEOUT_MS / 1000} seconds.`);
}

function closeCircuitBreaker(): void {
  circuitBreakerOpenUntil = 0;
  consecutiveFailures = 0;
}

// Rate limiting utilities
async function enforceRateLimit(): Promise<void> {
  // Check circuit breaker first
  if (isCircuitBreakerOpen()) {
    throw new Error(`Service temporarily unavailable due to rate limiting. Please try again in ${Math.ceil((circuitBreakerOpenUntil - Date.now()) / 1000)} seconds.`);
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    const waitTime = MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

// Exponential backoff retry utility
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.log(`Retrying Google Sheets API call in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      await enforceRateLimit();
      const result = await operation();
      
      // Success - reset circuit breaker
      closeCircuitBreaker();
      return result;
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a rate limit error
      if (error instanceof Error && (
        error.message.includes('429') || 
        error.message.includes('Quota exceeded') ||
        error.message.includes('rate limit')
      )) {
        consecutiveFailures++;
        
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          openCircuitBreaker();
        }
        
        if (attempt === maxRetries) {
          throw new Error(`Google Sheets API rate limit exceeded. Please try again in a few minutes. Original error: ${error.message}`);
        }
        console.warn(`Rate limit hit on attempt ${attempt + 1}, retrying...`);
        continue;
      }
      
      // For non-rate-limit errors, don't retry
      consecutiveFailures++;
      throw error;
    }
  }
  
  throw lastError!;
}

// Check if cache is still valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MS;
}

async function getInitializedDoc(): Promise<GoogleSpreadsheet> {
  // Try to use cached credentials if available and docInstance is not set or info not loaded
  if (docInstance && docInfoLoaded && 
      process.env.GOOGLE_SHEET_ID === cachedSheetId &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL === cachedServiceAccountEmail &&
      process.env.GOOGLE_PRIVATE_KEY === cachedPrivateKey) {
    return docInstance;
  }

  // If there's already a pending initialization, wait for it
  if (pendingDocInitialization) {
    return pendingDocInitialization;
  }

  // Start the initialization and cache the promise
  pendingDocInitialization = initializeDocWithRetry();

  try {
    const result = await pendingDocInitialization;
    return result;
  } finally {
    pendingDocInitialization = null;
  }
}

async function initializeDocWithRetry(): Promise<GoogleSpreadsheet> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID is not defined in .env.local. Please ensure it is set.');
  }
  if (!serviceAccountEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined in .env.local. Please ensure it is set.');
  }
  if (!rawPrivateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY is not defined in .env.local. Please ensure it is set and properly formatted (e.g., newlines escaped as \\n in the .env.local file).');
  }
  
  console.log("Attempting to initialize Google Sheets connection with environment variables...");

  const privateKeyProcessed = rawPrivateKey.replace(/\\n/g, '\n');

  const jwt = new JWT({
    email: serviceAccountEmail,
    key: privateKeyProcessed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const newDocInstance = new GoogleSpreadsheet(sheetId, jwt);
  
  return retryWithBackoff(async () => {
    try {
      await newDocInstance.loadInfo(); // Loads document properties and worksheets
      docInstance = newDocInstance;
      docInfoLoaded = true;

      // Cache the successfully used environment variable values
      cachedSheetId = sheetId;
      cachedServiceAccountEmail = serviceAccountEmail;
      cachedPrivateKey = rawPrivateKey; // Cache the raw key as it was read from env

      console.log(`Successfully loaded Google Sheet document: "${docInstance.title}"`);
      return docInstance;
    } catch (error) {
      console.error("Failed to load Google Sheet document info:", error);
      // Clear potentially stale cache on error
      docInstance = null;
      docInfoLoaded = false;
      cachedSheetId = null;
      cachedServiceAccountEmail = null;
      cachedPrivateKey = null;
      throw new Error(`Failed to load Google Sheet. Check sheet ID, permissions for ${serviceAccountEmail}, and credentials. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

const getString = (row: GoogleSpreadsheetRow<any>, header: string): string => row.get(header)?.toString().trim() || '';
const getOptionalString = (row: GoogleSpreadsheetRow<any>, header: string): string | undefined => {
  const val = row.get(header)?.toString().trim();
  return val ? val : undefined;
}
const getNumber = (row: GoogleSpreadsheetRow<any>, header: string): number | undefined => {
  const valStr = row.get(header)?.toString().trim();
  if (valStr === undefined || valStr === null || valStr === '') return undefined;
  const val = parseFloat(valStr);
  return isNaN(val) ? undefined : val;
}
const getArrayStrings = (row: GoogleSpreadsheetRow<any>, header: string): string[] | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  
  return val
    .split(',')
    .map((s: string) => s.trim())
    .map((s: string) => s.replace(/^#/, '').trim()) // Remove leading # if present
    .filter((s: string) => s); // Remove empty strings
}
const getJSON = <T>(row: GoogleSpreadsheetRow<any>, header: string): T | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    console.warn(`Failed to parse JSON for header "${header}" in row ${row.rowNumber}:`, e, `Value: "${val}"`);
    return undefined;
  }
}

// Add this helper function after the other helper functions
const parseFeatures = (featuresString: string): { name: string; description?: string }[] => {
  if (!featuresString) return [];
  
  return featuresString.split(',').map(feature => {
    const trimmed = feature.trim();
    const match = trimmed.match(/^(.+?)(?:\s*\((.*)\))?$/);
    
    if (match) {
      return {
        name: match[1].trim(),
        description: match[2]?.trim()
      };
    }
    
    return {
      name: trimmed,
      description: undefined
    };
  });
};

// Update the getDirectoryItems function
export async function getDirectoryItems(searchTerm?: string, categoryFilter?: string): Promise<DirectoryItem[]> {
  // Check if we have valid cached data and no specific search/filter
  if (allItemsCache && isCacheValid(allItemsCacheTimestamp) && !searchTerm && !categoryFilter) {
    return allItemsCache;
  }

  // If there's a pending request for items and no search/filter, wait for it
  if (pendingItemsRequest && !searchTerm && !categoryFilter) {
    return pendingItemsRequest;
  }

  // For searches and filters, we still need the base data
  if (!allItemsCache || !isCacheValid(allItemsCacheTimestamp)) {
    if (!pendingItemsRequest) {
      // Start fetching fresh data
      pendingItemsRequest = fetchDirectoryItemsFromSheet();
    }
    
    // Wait for the fresh data
    try {
      await pendingItemsRequest;
    } finally {
      pendingItemsRequest = null;
    }
  }

  // Now apply filters to the cached data
  let items = allItemsCache!;

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchTerms = lowerSearchTerm.split(/\s+/).filter(term => term.length > 0);
    
    items = items.filter(item => {
      const description = item.description.toLowerCase();
      const tagline = item.tagline.toLowerCase();
      const name = item.name.toLowerCase();
      const tags = item.tags?.map(tag => tag.toLowerCase()) || [];
      
      // Check if all search terms are found in any of the fields
      return searchTerms.every(term => 
        description.includes(term) || 
        tagline.includes(term) || 
        name.includes(term) ||
        tags.some(tag => tag.includes(term))
      );
    });
  }
  
  if (categoryFilter) {
    const categoryFilters = categoryFilter.split(',');
    items = items.filter(item => {
      // Split item's categories and check if any overlap with the filter
      const itemCategories = item.category.split(',').map(cat => cat.trim());
      return itemCategories.some(itemCat => categoryFilters.includes(itemCat));
    });
  }
  
  return items;
}

async function fetchDirectoryItemsFromSheet(): Promise<DirectoryItem[]> {
  return retryWithBackoff(async () => {
    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.ITEMS];
    if (!sheet) {
      console.error(`Sheet '${SHEET_NAMES.ITEMS}' not found. Check SHEET_NAMES configuration in src/lib/sheets.ts.`);
      return [];
    }
    
    const rows = await sheet.getRows();
    const CM = COLUMN_MAPPINGS.ITEMS; // Alias for brevity
    
    const items: DirectoryItem[] = rows.map((row): DirectoryItem => {
      const baseId = getString(row, CM.ID);
      return {
        id: `${baseId}-${row.rowNumber}`, // Make ID unique by combining with row number
        slug: baseId, // Keep the original ID as the slug
        name: getString(row, CM.NAME),
        tagline: getString(row, CM.TAGLINE),
        description: getString(row, CM.DESCRIPTION),
        category: getString(row, CM.CATEGORY_SLUG),
        website: getString(row, CM.WEBSITE),
        imageUrl: getOptionalString(row, CM.IMAGE_URL),
        features: parseFeatures(getString(row, CM.FEATURES_JSON)),
        pricing: getOptionalString(row, CM.PRICING),
        bestFor: getOptionalString(row, CM.BEST_FOR),
        tags: getArrayStrings(row, CM.TAGS),
        rating: getNumber(row, CM.RATING),
      };
    });

    // Update cache
    allItemsCache = items;
    allItemsCacheTimestamp = Date.now();
    
    console.log(`Successfully fetched ${items.length} directory items from Google Sheets`);
    return items;
  });
}

export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  const items = await getDirectoryItems();
  return items.find(item => item.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const allDirItems = await getDirectoryItems();
  
  // Update itemCount for each category based on actual items
  return HARDCODED_CATEGORIES.map(category => ({
    ...category,
    itemCount: allDirItems.filter(item => {
      // Split item's categories and check if this category is included
      const itemCategories = item.category.split(',').map(cat => cat.trim());
      return itemCategories.includes(category.slug);
    }).length
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug);
}

// Newsletter subscription (Mailchimp integration placeholder)
// To enable Mailchimp integration:
// 1. Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in your environment variables.
// 2. Implement the API call in the function below.

export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // TODO: Integrate with Mailchimp API
  // Example:
  // const response = await fetch('https://<dc>.api.mailchimp.com/3.0/lists/' + process.env.MAILCHIMP_LIST_ID + '/members', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'apikey ' + process.env.MAILCHIMP_API_KEY,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  // });
  // if (response.ok) return { success: true, message: 'Successfully subscribed to the newsletter!' };
  // else return { success: false, message: 'Subscription failed. Please try again later.' };

  return { success: true, message: 'This would subscribe to Mailchimp. (Integration not yet implemented.)' };
}

export async function getItemsForComparison(ids: string[]): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems.filter(item => ids.includes(item.id));
}

export async function getAISuggestedDifferences(itemsToCompare: DirectoryItem[]): Promise<string[]> {
  if (itemsToCompare.length < 2) return ["Please select at least two items to compare."];

  const suggestions = [
    `${itemsToCompare[0].name} excels in ${itemsToCompare[0].features?.[0]?.name || 'key areas'}, while ${itemsToCompare[1].name} offers strong ${itemsToCompare[1].features?.[0]?.name || 'alternative features'}.`,
    `Consider ${itemsToCompare[0].name}'s pricing (${itemsToCompare[0].pricing || 'N/A'}) versus ${itemsToCompare[1].name}'s (${itemsToCompare[1].pricing || 'N/A'}) for your budget.`,
  ];
  if (itemsToCompare.length > 2 && itemsToCompare[2]) {
    suggestions.push(`${itemsToCompare[2].name} provides a unique approach with its ${itemsToCompare[2].tagline?.toLowerCase() || 'features'}.`);
  }
  return suggestions;
}

export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems
    .filter(item => typeof item.rating === 'number') 
    .sort((a,b) => (b.rating!) - (a.rating!)) 
    .slice(0, limit);
}

export function clearSheetCache() {
  allItemsCache = null;
  allItemsCacheTimestamp = 0;
  docInstance = null; 
  docInfoLoaded = false;
  cachedSheetId = null;
  cachedServiceAccountEmail = null;
  cachedPrivateKey = null;
  pendingDocInitialization = null;
  pendingItemsRequest = null;
  // Reset circuit breaker
  closeCircuitBreaker();
  console.log("Sheet cache and Google Doc instance cleared. Data will be re-fetched on next request.");
}

// Debug function to check circuit breaker status
export function getCircuitBreakerStatus() {
  return {
    isOpen: isCircuitBreakerOpen(),
    openUntil: circuitBreakerOpenUntil,
    consecutiveFailures,
    timeRemaining: Math.max(0, circuitBreakerOpenUntil - Date.now())
  };
}
