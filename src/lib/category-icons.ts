import { Activity, Play, TrendingUp, Users, RotateCcw, TestTube, DollarSign, Brain, MessageSquare, Search, PieChart, FileText, Building, type LucideIcon } from 'lucide-react';

// Icon mapping for SSR-safe icon handling
export const CATEGORY_ICONS = {
  'property-search-acquisition': Search,
  'property-analysis-valuation': DollarSign,
  'development-construction': Building,
  'transactions-brokerage': TrendingUp,
  'property-management-operations': PieChart,
  'legal-compliance-duediligence': FileText,
  'asset-portfolio-management': PieChart,
  'marketing-leasing-enablement': Users,
  'data-workflow-infrastructure': TestTube,
  'productivity-copilots': Brain,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;
