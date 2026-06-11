/**
 * SEO persona hub config for /for/[persona] landing pages.
 * Aligned with docs/SEO-KEYWORDS.md role-based clusters.
 */

import type { SeoFaq } from '@/config/seo-clusters';

export interface SeoPersona {
  slug: string;
  name: string;
  shortLabel: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  workflows: string[];
  categorySlugs: string[];
  faqs: SeoFaq[];
}

const SEO_PERSONAS: SeoPersona[] = [
  {
    slug: 'investors',
    name: 'Commercial Real Estate Investors',
    shortLabel: 'For Investors',
    h1: 'AI Tools for Commercial Real Estate Investors',
    metaTitle: 'AI Tools for CRE Investors (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI tools for commercial real estate investors. Underwriting, deal sourcing, diligence, and portfolio analysis in one directory.',
    intro:
      'Commercial real estate investors use AI software to source deals faster, underwrite with fewer manual steps, and run diligence without drowning in PDFs. This curated directory maps tools to investor workflows—from acquisition through asset management—so you can compare options built for CRE, not generic proptech.',
    workflows: [
      'Deal sourcing and off-market discovery',
      'Investment analysis and AI-assisted underwriting',
      'Due diligence and lease abstraction',
      'Portfolio performance and disposition planning',
    ],
    categorySlugs: [
      'property-search-acquisition',
      'property-analysis-valuation',
      'legal-compliance-due-diligence',
      'asset-portfolio-management',
    ],
    faqs: [
      {
        question: 'What AI tools do commercial real estate investors use most?',
        answer:
          'Investors most often adopt tools for underwriting and financial modeling, deal sourcing, and due diligence document review. Portfolio reporting and market analytics follow as holdings scale. The right mix depends on whether you are acquisitive, value-add, or core-focused.',
      },
      {
        question: 'How should an investment team start with CRE AI?',
        answer:
          'Pick one high-friction workflow—usually rent-roll intake or OM summarization—and pilot a tool on a closed deal before live use. Ensure outputs feed your existing IC templates and that counsel reviews anything used in diligence or investor communications.',
      },
      {
        question: 'Are AI underwriting tools accurate enough for investment decisions?',
        answer:
          'They accelerate data prep and flag anomalies; they do not replace analyst judgment on assumptions or market views. Treat AI outputs as drafts, keep audit trails, and validate critical fields against source documents before committee presentations.',
      },
      {
        question: 'Do these tools work for small investment shops?',
        answer:
          'Many vendors offer per-seat or per-deal pricing suitable for lean teams. Associates at smaller firms often see the largest time savings because they wear multiple hats across sourcing, modeling, and reporting.',
      },
    ],
  },
  {
    slug: 'developers',
    name: 'Real Estate Developers',
    shortLabel: 'For Developers',
    h1: 'AI Tools for Commercial Real Estate Developers',
    metaTitle: 'AI Tools for CRE Developers (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI tools for commercial real estate developers. Feasibility, construction management, and project delivery workflows.',
    intro:
      'Developers juggle feasibility, entitlements, budgets, and field coordination across every project. AI tools in this directory help CRE development teams forecast costs, manage construction workflows, and connect project data to investor reporting—without adopting generic construction apps that ignore commercial nuances.',
    workflows: [
      'Development feasibility and pro forma support',
      'Construction scheduling and cost control',
      'Permit and document coordination',
      'Handoff to asset management and leasing',
    ],
    categorySlugs: [
      'development-construction',
      'property-analysis-valuation',
      'legal-compliance-due-diligence',
      'data-workflow-infrastructure',
    ],
    faqs: [
      {
        question: 'What AI tools help real estate developers the most?',
        answer:
          'Developers benefit from feasibility and budgeting tools, construction project management with AI risk alerts, and document platforms that keep draws and lender reporting current. Site selection and market analytics matter early; field tools dominate during active builds.',
      },
      {
        question: 'Can development AI replace project managers?',
        answer:
          'No—AI surfaces schedule and budget risk earlier and automates status reporting. Superintendents and development managers still own contractor relationships, quality, and stakeholder decisions on change orders.',
      },
      {
        question: 'How do developers evaluate new proptech?',
        answer:
          'Run pilots on one active project with clear success metrics—RFI turnaround, forecast accuracy, or hours saved on monthly investor updates. Prefer tools that integrate with your accounting and draw systems to avoid duplicate entry.',
      },
      {
        question: 'Are these tools only for ground-up development?',
        answer:
          'Many apply to repositioning and major TI projects as well. Confirm the vendor supports your project type (office reposition, industrial spec, mixed-use) and whether they handle both pre-development and construction phases.',
      },
    ],
  },
  {
    slug: 'brokers',
    name: 'Commercial Real Estate Brokers',
    shortLabel: 'For Brokers',
    h1: 'AI Tools for Commercial Real Estate Brokers',
    metaTitle: 'AI Tools for CRE Brokers (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI tools for commercial real estate brokers. CRM, transaction management, leasing, and client enablement.',
    intro:
      'Brokerage teams win mandates with speed, market knowledge, and polished client deliverables. These AI tools support CRE brokers across CRM, transaction pipelines, marketing collateral, and leasing enablement—so reps spend more time on relationships and less on repetitive research and document prep.',
    workflows: [
      'Deal pipeline and brokerage CRM',
      'Investment sales and leasing marketing',
      'Comp research and client presentations',
      'Transaction coordination through closing',
    ],
    categorySlugs: [
      'transactions-brokerage',
      'marketing-leasing-enablement',
      'property-search-acquisition',
      'productivity-copilots',
    ],
    faqs: [
      {
        question: 'What is the best CRM approach for commercial real estate brokerage?',
        answer:
          'Choose a CRM built for CRE deals—properties, spaces, commissions, and co-broker splits—not a generic sales CRM retrofitted with custom fields. Adoption beats feature depth; pick software your team will log calls and tours into daily.',
      },
      {
        question: 'How can AI help brokers without hurting compliance?',
        answer:
          'Use AI for internal drafts, comp summaries, and follow-up reminders. Review all client-facing OMs and emails against your firm policy. Many brokerages require disclosure when marketing materials use AI-generated imagery or copy.',
      },
      {
        question: 'Which tools matter for leasing vs. investment sales?',
        answer:
          'Leasing teams prioritize tour tech, listing syndication, and proposal tools. Investment sales needs OM production, buyer outreach, and data room coordination. Some platforms cover both; others excel in one lane.',
      },
      {
        question: 'Do small brokerage teams need the same stack as nationals?',
        answer:
          'Smaller teams often start with a CRM plus a copilot for writing and research. Add vertical tools as deal volume justifies—avoid paying for enterprise data feeds you will not use in year one.',
      },
    ],
  },
  {
    slug: 'asset-managers',
    name: 'Asset Managers',
    shortLabel: 'For Asset Managers',
    h1: 'AI Tools for Commercial Real Estate Asset Managers',
    metaTitle: 'AI Tools for CRE Asset Managers (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI tools for CRE asset managers. Portfolio analytics, performance reporting, and asset-level operations.',
    intro:
      'Asset managers need timely visibility across NOI, lease rollover, capex, and business plans for every holding. This directory highlights AI tools for portfolio management, property operations, and analysis—helping asset managers intervene before variances show up in investor reports.',
    workflows: [
      'Portfolio performance and benchmarking',
      'Business plan tracking and variance analysis',
      'Lease rollover and risk monitoring',
      'Coordination with property management and capital teams',
    ],
    categorySlugs: [
      'asset-portfolio-management',
      'property-analysis-valuation',
      'property-management-operations',
      'legal-compliance-due-diligence',
    ],
    faqs: [
      {
        question: 'What is commercial real estate portfolio management software?',
        answer:
          'It consolidates asset-level financials, leases, and KPIs for oversight across a portfolio. Asset managers use it for budgeting, investor reporting, disposition analysis, and tracking initiatives against business plans.',
      },
      {
        question: 'How does AI help asset managers specifically?',
        answer:
          'AI can highlight assets trailing peers, summarize quarterly performance narratives, and flag lease events requiring action. It reduces time assembling board packs—not the strategic calls on hold, sell, or refinance.',
      },
      {
        question: 'What integrations should asset managers require?',
        answer:
          'Live feeds from property management and accounting, consistent property IDs, and export to investor reporting formats. Without clean ingestion, portfolio dashboards become stale within a quarter.',
      },
      {
        question: 'Is dedicated software needed for small portfolios?',
        answer:
          'Owners with a handful of assets may use spreadsheets until investor or lender reporting demands audit-ready rollups. Ten or more assets with multiple stakeholders is usually when dedicated portfolio tools pay off.',
      },
    ],
  },
  {
    slug: 'property-managers',
    name: 'Property Managers',
    shortLabel: 'For Property Managers',
    h1: 'AI Tools for Commercial Property Managers',
    metaTitle: 'Property Management AI Tools (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI property management tools for commercial real estate. Tenant service, operations, leasing admin, and reporting.',
    intro:
      'Property managers balance tenant experience, engineering response, lease compliance, and owner reporting across every building. These AI tools automate routine service requests, lease lookups, and operating summaries so on-site and regional teams focus on relationships and capital projects.',
    workflows: [
      'Tenant communication and service requests',
      'Maintenance and vendor coordination',
      'Lease administration and CAM processes',
      'Owner and asset manager reporting',
    ],
    categorySlugs: [
      'property-management-operations',
      'marketing-leasing-enablement',
      'legal-compliance-due-diligence',
      'productivity-copilots',
    ],
    faqs: [
      {
        question: 'What is the best AI property management software for commercial buildings?',
        answer:
          'The best fit depends on asset class and portfolio size. Prioritize tenant portals, work order automation, lease data access, and integrations with your accounting system. AI features should reduce ticket volume—not add another app field teams ignore.',
      },
      {
        question: 'Can AI improve tenant satisfaction in commercial properties?',
        answer:
          'Faster responses, proactive maintenance alerts, and accurate lease answers improve satisfaction. AI handles tier-one inquiries; property managers still own escalations, renewals, and relationship building with anchor tenants.',
      },
      {
        question: 'How should PM teams pilot new technology?',
        answer:
          'Start at one property with a clear metric—mean time to resolve tickets or hours on monthly owner reports. Involve chief engineers and assistant managers in selection; they determine adoption more than regional VPs.',
      },
      {
        question: 'Do PM tools connect to leasing and asset management?',
        answer:
          'Leading platforms push lease commencements, rent rolls, and operating data upstream. Confirm bidirectional sync so asset managers see the same NOI and occupancy PM teams report to owners.',
      },
    ],
  },
  {
    slug: 'operators',
    name: 'CRE Operators',
    shortLabel: 'For Operators',
    h1: 'AI Tools for Commercial Real Estate Operators',
    metaTitle: 'AI Tools for CRE Operators (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI tools for commercial real estate operators. Operations, copilots, data workflows, and cross-functional productivity.',
    intro:
      'Owner-operators and platform teams span property management, leasing, finance, and capital projects—often with lean headcount. This page curates AI tools for daily operations, workflow automation, and copilots that cut across functions so operators move faster without adding headcount for every new initiative.',
    workflows: [
      'Cross-functional workflow automation',
      'Operations and property management',
      'AI copilots for research and documents',
      'Data integration across the tech stack',
    ],
    categorySlugs: [
      'property-management-operations',
      'productivity-copilots',
      'data-workflow-infrastructure',
      'marketing-leasing-enablement',
    ],
    faqs: [
      {
        question: 'Who counts as a CRE operator in this directory?',
        answer:
          'Owner-operators, vertically integrated firms, and platform teams that run assets day-to-day—not just third-party property managers. They need tools spanning ops, leasing, and reporting rather than a single vertical app.',
      },
      {
        question: 'Should operators prioritize copilots or vertical software?',
        answer:
          'Start with the bottleneck: if tenant service is drowning the team, fix operations first. If analysts are the constraint, copilots and data integration may come first. Most mature operators run a stack of vertical tools plus a copilot layer.',
      },
      {
        question: 'How do operators avoid tool sprawl?',
        answer:
          'Standardize on a PM or portfolio system of record, then add AI that integrates rather than duplicates. Audit licenses quarterly—unused copilot seats are common when teams lack training or approved use cases.',
      },
      {
        question: 'What data infrastructure do operators need before AI?',
        answer:
          'Consistent property IDs, timely rent rolls, and automated feeds from accounting beat flashy AI on bad data. Workflow and integration tools often deliver more ROI than another standalone assistant.',
      },
    ],
  },
];

const personaBySlug = new Map(SEO_PERSONAS.map((p) => [p.slug, p]));

export function getSeoPersona(slug: string): SeoPersona | undefined {
  return personaBySlug.get(slug);
}

export function getAllSeoPersonaSlugs(): string[] {
  return SEO_PERSONAS.map((p) => p.slug);
}

export function getAllSeoPersonas(): SeoPersona[] {
  return SEO_PERSONAS;
}

export function getPersonaShortLabel(slug: string): string {
  return personaBySlug.get(slug)?.shortLabel ?? slug;
}
