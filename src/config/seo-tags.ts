/**
 * Curated SEO tag pages — matched against tool features[] (no DB column).
 * Aligned with docs/SEO-KEYWORDS.md P2 workflow terms.
 */

import type { SeoFaq } from '@/config/seo-clusters';

export const MIN_TOOLS_FOR_INDEXABLE_TAG = 3;

export interface SeoTag {
  slug: string;
  label: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faqs: SeoFaq[];
  relatedCategorySlugs: string[];
  relatedTagSlugs: string[];
  /** Case-insensitive substring match against item.features[].name */
  featureMatchers: string[];
}

const SEO_TAGS: SeoTag[] = [
  {
    slug: 'lease-abstraction',
    label: 'Lease Abstraction',
    h1: 'Lease Abstraction AI Tools for Commercial Real Estate',
    metaTitle: 'Lease Abstraction AI Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} lease abstraction AI tools for CRE. Extract rent, options, and clauses from lease PDFs faster.',
    intro:
      'Lease abstraction AI tools convert commercial lease PDFs into structured data—rent schedules, options, co-tenancy, and termination rights—so analysts review exceptions instead of retyping every clause. Investors, asset managers, and diligence teams use them during acquisitions and portfolio onboarding.',
    faqs: [
      { question: 'What is lease abstraction AI software?', answer: 'It uses machine learning to pull key lease terms from PDFs into structured fields. Humans validate extractions rather than manually abstracting every document from scratch.' },
      { question: 'Who uses lease abstraction tools in CRE?', answer: 'Acquisition teams, asset managers onboarding new properties, and legal operations groups managing large lease portfolios across office, retail, and industrial assets.' },
      { question: 'How accurate is AI lease abstraction?', answer: 'Accuracy varies by document quality and vendor. Always plan human review on material economic terms before relying on outputs for underwriting or investor reporting.' },
      { question: 'Does lease abstraction replace attorneys?', answer: 'No. Software accelerates first-pass review; counsel still signs off on exceptions, estoppels, and structural deal terms.' },
    ],
    relatedCategorySlugs: ['legal-compliance-due-diligence', 'property-management-operations'],
    relatedTagSlugs: ['due-diligence', 'lease-administration'],
    featureMatchers: ['lease abstraction', 'lease', 'abstract'],
  },
  {
    slug: 'underwriting',
    label: 'AI Underwriting',
    h1: 'Commercial Real Estate AI Underwriting Tools',
    metaTitle: 'CRE AI Underwriting Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI underwriting tools for commercial real estate. Model deals, parse rent rolls, and speed investment analysis.',
    intro:
      'AI underwriting tools help CRE investors and analysts ingest offering memos and rent rolls, normalize assumptions, and produce consistent financial models faster than manual spreadsheet workflows. They reduce data-entry time while keeping human judgment on cap rates, growth, and exit strategy.',
    faqs: [
      { question: 'What is commercial real estate AI underwriting?', answer: 'Software that applies AI to extract deal data, flag inconsistencies, and accelerate cash-flow modeling for acquisitions and refinancings.' },
      { question: 'Can AI replace an analyst on underwriting?', answer: 'No. AI handles repetitive extraction and formatting; analysts still set assumptions, stress scenarios, and present to investment committees.' },
      { question: 'What should I evaluate in underwriting AI?', answer: 'Asset-class support, audit trails, export to your IC template, and integration with your data room or CRM.' },
      { question: 'Do these tools work for value-add deals?', answer: 'Many support renovation and repositioning scenarios, but confirm the vendor handles your typical deal complexity before rollout.' },
    ],
    relatedCategorySlugs: ['property-analysis-valuation', 'property-search-acquisition'],
    relatedTagSlugs: ['property-valuation', 'due-diligence'],
    featureMatchers: ['underwriting', 'underwrite', 'investment analysis', 'financial model'],
  },
  {
    slug: 'due-diligence',
    label: 'Due Diligence',
    h1: 'Commercial Real Estate Due Diligence Software',
    metaTitle: 'CRE Due Diligence Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} due diligence tools for commercial real estate. Document review, risk flags, and transaction workflows.',
    intro:
      'Due diligence software organizes and accelerates document-heavy CRE transactions—leases, environmental reports, title, and service contracts. AI layers add extraction, risk surfacing, and checklist automation so teams close with fewer surprises and less outside counsel spend on routine review.',
    faqs: [
      { question: 'What is CRE due diligence software?', answer: 'Platforms that manage diligence checklists, document rooms, and AI-assisted review across legal, financial, and physical property workstreams.' },
      { question: 'When should teams adopt diligence AI?', answer: 'When deal volume or document complexity makes manual review a bottleneck—typically during active acquisition periods or portfolio roll-ups.' },
      { question: 'What documents should diligence tools support?', answer: 'Leases, amendments, Phase I/II summaries, title commitments, service contracts, and asset-class-specific reports.' },
      { question: 'How does diligence software reduce risk?', answer: 'By standardizing review, tracking open items, and surfacing anomalies earlier in the timeline before hard money is at risk.' },
    ],
    relatedCategorySlugs: ['legal-compliance-due-diligence'],
    relatedTagSlugs: ['lease-abstraction', 'underwriting'],
    featureMatchers: ['due diligence', 'diligence', 'document review', 'contract analysis'],
  },
  {
    slug: 'deal-sourcing',
    label: 'Deal Sourcing',
    h1: 'CRE Deal Sourcing & Off-Market Discovery Tools',
    metaTitle: 'CRE Deal Sourcing Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} deal sourcing tools for commercial real estate. Find acquisitions, site selection, and off-market opportunities.',
    intro:
      'Deal sourcing tools help CRE investors and brokers discover, filter, and prioritize acquisition opportunities using property data, market signals, and alerts. AI improves matching and speed so teams engage on the right deals before competitors.',
    faqs: [
      { question: 'What is commercial real estate deal sourcing software?', answer: 'Software that aggregates listings, ownership data, and market signals to build acquisition pipelines and off-market target lists.' },
      { question: 'Who benefits from AI deal sourcing?', answer: 'Investors, acquisition analysts, and brokerage teams expanding into new markets or asset classes.' },
      { question: 'How is this different from underwriting tools?', answer: 'Sourcing finds opportunities; underwriting evaluates them. Many teams use both in sequence.' },
      { question: 'What data coverage matters most?', answer: 'Geographies and asset classes you actually buy, plus freshness of ownership and debt maturity signals if you pursue off-market.' },
    ],
    relatedCategorySlugs: ['property-search-acquisition'],
    relatedTagSlugs: ['underwriting', 'property-valuation'],
    featureMatchers: ['deal sourcing', 'sourcing', 'acquisition', 'off-market', 'site selection'],
  },
  {
    slug: 'portfolio-analytics',
    label: 'Portfolio Analytics',
    h1: 'Commercial Real Estate Portfolio Analytics Tools',
    metaTitle: 'CRE Portfolio Analytics Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} portfolio analytics tools for CRE. Track NOI, rollover risk, and asset performance across holdings.',
    intro:
      'Portfolio analytics tools give asset managers and investors a consolidated view of performance, lease rollover, and variance against business plans. AI highlights underperformers and drafts narrative summaries for investor reporting.',
    faqs: [
      { question: 'What is CRE portfolio analytics software?', answer: 'Systems that roll up property-level KPIs into portfolio dashboards for asset managers, owners, and LPs.' },
      { question: 'How does AI help portfolio reporting?', answer: 'It can flag NOI drift, predict rollover exposure, and automate quarterly commentary drafts for human review.' },
      { question: 'What integrations are required?', answer: 'Feeds from property management and accounting with consistent property identifiers.' },
      { question: 'Is this only for institutional owners?', answer: 'Mid-market owners with 10+ assets often benefit once investor or lender reporting requires audit-ready rollups.' },
    ],
    relatedCategorySlugs: ['asset-portfolio-management', 'property-analysis-valuation'],
    relatedTagSlugs: ['property-valuation', 'underwriting'],
    featureMatchers: ['portfolio', 'asset management', 'performance', 'analytics', 'benchmark'],
  },
  {
    slug: 'lease-administration',
    label: 'Lease Administration',
    h1: 'Commercial Lease Administration Software',
    metaTitle: 'CRE Lease Administration Tools (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} lease administration tools for commercial real estate. Manage leases, renewals, and tenant obligations.',
    intro:
      'Lease administration software tracks critical dates, rent steps, options, and tenant obligations across a commercial portfolio. AI assists with abstract lookups, anomaly detection on rent rolls, and automated reminders for renewals and compliance.',
    faqs: [
      { question: 'What is lease administration software?', answer: 'A system of record for lease terms, critical dates, and amendments across a CRE portfolio—often connected to accounting and property management.' },
      { question: 'How is it different from lease abstraction?', answer: 'Abstraction is the intake process; administration is ongoing lifecycle management after data is in the system.' },
      { question: 'What causes failed lease admin rollouts?', answer: 'Stale data after acquisition without re-abstraction, or PM teams not trained to update amendments promptly.' },
      { question: 'Can AI reduce lease admin errors?', answer: 'Yes, by flagging mismatches between billed rent and abstracted terms and surfacing upcoming options automatically.' },
    ],
    relatedCategorySlugs: ['property-management-operations', 'legal-compliance-due-diligence'],
    relatedTagSlugs: ['lease-abstraction', 'due-diligence'],
    featureMatchers: ['lease administration', 'lease management', 'lease admin', 'critical dates'],
  },
  {
    slug: 'transaction-management',
    label: 'Transaction Management',
    h1: 'Commercial Real Estate Transaction Management Software',
    metaTitle: 'CRE Transaction Management (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} CRE transaction management tools. Deal pipelines, brokerage CRM, and closing workflows.',
    intro:
      'Transaction management software coordinates CRE deals from pitch through closing—parties, documents, deadlines, and commissions. Brokerage CRM features keep client relationships and listing activity in one place with AI assisting comps and follow-ups.',
    faqs: [
      { question: 'What is CRE transaction management software?', answer: 'Platforms that track deal stages, documents, and stakeholders for investment sales, leasing, and debt transactions.' },
      { question: 'How is a CRE CRM different from Salesforce?', answer: 'CRE CRMs model properties, spaces, commissions, and co-broker splits—not just contacts and opportunities.' },
      { question: 'What should brokers prioritize?', answer: 'Mobile access, marketing integration, and adoption simplicity over feature breadth.' },
      { question: 'Can AI help transaction teams?', answer: 'Yes—for comp summaries, draft emails, and stale-deal reminders, with compliance review on client-facing content.' },
    ],
    relatedCategorySlugs: ['transactions-brokerage'],
    relatedTagSlugs: ['deal-sourcing', 'real-estate-copilot'],
    featureMatchers: ['transaction', 'crm', 'brokerage', 'deal pipeline', 'commission'],
  },
  {
    slug: 'property-valuation',
    label: 'Property Valuation',
    h1: 'Commercial Property Valuation & Analysis Tools',
    metaTitle: 'CRE Property Valuation Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} property valuation tools for commercial real estate. Automated comps, modeling, and market analysis.',
    intro:
      'Property valuation tools support automated comps, income capitalization, and scenario analysis for commercial assets. AI accelerates comp selection, market rent inference, and sensitivity tables used in IC memos and lender packages.',
    faqs: [
      { question: 'What is commercial property valuation software?', answer: 'Tools that model income, select comparables, and produce valuation outputs for acquisitions, refinancings, and dispositions.' },
      { question: 'Can AI replace an appraiser?', answer: 'No for formal appraisals. AI supports internal valuation and screening; certified appraisals still require licensed professionals where required.' },
      { question: 'What asset classes need special support?', answer: 'Multifamily, office, industrial, and retail each need different comp and rent-roll conventions—confirm vendor depth.' },
      { question: 'How do valuation tools connect to underwriting?', answer: 'Many export to or integrate with underwriting models so assumptions stay consistent from screening through closing.' },
    ],
    relatedCategorySlugs: ['property-analysis-valuation'],
    relatedTagSlugs: ['underwriting', 'portfolio-analytics'],
    featureMatchers: ['valuation', 'appraisal', 'comps', 'comparable', 'market analysis'],
  },
  {
    slug: 'construction-management',
    label: 'Construction Management',
    h1: 'AI Construction Management Tools for CRE',
    metaTitle: 'CRE Construction Management AI (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} construction management AI tools for real estate development. Schedules, budgets, and field coordination.',
    intro:
      'Construction management tools help developers and GC partners track schedules, budgets, RFIs, and field progress on CRE projects. AI surfaces schedule risk, cost drift, and document bottlenecks before they become change orders.',
    faqs: [
      { question: 'What is CRE construction management software?', answer: 'Platforms for scheduling, cost control, document management, and contractor coordination on development and TI projects.' },
      { question: 'How can AI help construction PM?', answer: 'Early warnings on schedule slip, budget variance by cost code, and automated status summaries for lenders and investors.' },
      { question: 'What integrations matter?', answer: 'Accounting, draw management, BIM or drawing repositories, and owner reporting templates.' },
      { question: 'Is this only for ground-up development?', answer: 'Major repositioning and large TI programs often use the same toolchains as new construction.' },
    ],
    relatedCategorySlugs: ['development-construction'],
    relatedTagSlugs: ['due-diligence'],
    featureMatchers: ['construction', 'project management', 'scheduling', 'rfi', 'cost'],
  },
  {
    slug: 'real-estate-copilot',
    label: 'Real Estate Copilot',
    h1: 'AI Copilots for Commercial Real Estate Teams',
    metaTitle: 'CRE AI Copilot Tools (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI copilots for commercial real estate. Research, documents, and daily workflow assistance.',
    intro:
      'Real estate copilots are AI assistants configured for CRE workflows—summarizing OMs, drafting emails, answering portfolio questions, and pulling metrics from connected systems. They reduce context-switching for lean deal teams.',
    faqs: [
      { question: 'What is a CRE AI copilot?', answer: 'An assistant that helps with research, writing, and light analysis across CRE tasks, often connected to your deal stack or document store.' },
      { question: 'How is a copilot different from vertical CRE software?', answer: 'Vertical tools own a workflow end-to-end; copilots span daily tasks across many tools.' },
      { question: 'What security should I require?', answer: 'Enterprise SSO, clear data retention policies, and confirmation that deal documents are not used to train public models.' },
      { question: 'Who benefits most?', answer: 'Associates, coordinators, and owner-operators who juggle memos, emails, and data pulls without dedicated analysts.' },
    ],
    relatedCategorySlugs: ['productivity-copilots', 'data-workflow-infrastructure'],
    relatedTagSlugs: ['transaction-management', 'underwriting'],
    featureMatchers: ['copilot', 'assistant', 'ai chat', 'generative', 'gpt'],
  },
  {
    slug: 'property-management',
    label: 'Property Management',
    h1: 'AI Property Management Software for Commercial Real Estate',
    metaTitle: 'CRE Property Management AI (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI property management tools for CRE. Tenant service, maintenance, and operations automation.',
    intro:
      'AI property management software automates tenant inquiries, work orders, and operating reports for commercial buildings. Operators reduce response times and standardize service while keeping on-site teams focused on relationships and capital projects.',
    faqs: [
      { question: 'What is commercial property management AI?', answer: 'Software that applies AI to tenant service, maintenance triage, lease lookups, and operating data synthesis for CRE assets.' },
      { question: 'What workflows show fastest ROI?', answer: 'Tenant ticketing, lease reminders, and preventive maintenance scheduling before portfolio-wide analytics.' },
      { question: 'Does AI replace property managers?', answer: 'No—it reduces admin load so managers focus on tenants, vendors, and owner communication.' },
      { question: 'What should landlords verify before buying?', answer: 'Asset-class fit, accounting integration, and mobile access for engineering staff.' },
    ],
    relatedCategorySlugs: ['property-management-operations'],
    relatedTagSlugs: ['lease-administration', 'real-estate-copilot'],
    featureMatchers: ['property management', 'tenant', 'work order', 'maintenance', 'facilities'],
  },
  {
    slug: 'market-analysis',
    label: 'Market Analysis',
    h1: 'Commercial Real Estate Market Analysis Tools',
    metaTitle: 'CRE Market Analysis Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} market analysis tools for commercial real estate. Trends, comps, and submarket intelligence.',
    intro:
      'Market analysis tools aggregate submarket data—rents, vacancies, absorption, and sales comps—for CRE investment and brokerage decisions. AI speeds report generation and highlights trends humans might miss in noisy data.',
    faqs: [
      { question: 'What is CRE market analysis software?', answer: 'Platforms that deliver submarket statistics, comp sets, and trend visualizations for acquisitions, leasing, and asset management.' },
      { question: 'How is this different from valuation tools?', answer: 'Market analysis emphasizes macro and submarket context; valuation tools focus on asset-specific income and pricing.' },
      { question: 'What data sources matter?', answer: 'Coverage for your target metros and asset classes, plus refresh frequency and methodology transparency.' },
      { question: 'Can brokers use market analysis AI?', answer: 'Yes—for client updates, pitch books, and tour preparation with faster comp and news synthesis.' },
    ],
    relatedCategorySlugs: ['property-analysis-valuation', 'property-search-acquisition'],
    relatedTagSlugs: ['property-valuation', 'deal-sourcing'],
    featureMatchers: ['market analysis', 'market data', 'submarket', 'trends', 'research'],
  },
  {
    slug: 'document-automation',
    label: 'Document Automation',
    h1: 'CRE Document Automation & AI Extraction Tools',
    metaTitle: 'CRE Document Automation (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} document automation tools for commercial real estate. Extract data from OMs, leases, and contracts.',
    intro:
      'Document automation tools extract structured data from offering memos, leases, rent rolls, and contracts. CRE teams use them to eliminate manual rekeying during underwriting, diligence, and portfolio onboarding.',
    faqs: [
      { question: 'What is CRE document automation?', answer: 'AI that reads PDFs and unstructured files to populate models, abstracts, and diligence checklists.' },
      { question: 'Which documents see the highest volume?', answer: 'Rent rolls, leases, offering memoranda, and service contracts during acquisitions and refinancings.' },
      { question: 'How do teams validate extractions?', answer: 'Sample audits, exception queues, and side-by-side PDF viewers until confidence is established per document type.' },
      { question: 'Is document AI the same as lease abstraction?', answer: 'Lease abstraction is a subset; document automation often covers broader file types across the deal lifecycle.' },
    ],
    relatedCategorySlugs: ['legal-compliance-due-diligence', 'productivity-copilots'],
    relatedTagSlugs: ['lease-abstraction', 'due-diligence'],
    featureMatchers: ['document', 'extraction', 'ocr', 'pdf', 'parse', 'data extraction'],
  },
  {
    slug: 'leasing-automation',
    label: 'Leasing Automation',
    h1: 'Commercial Leasing Automation & Enablement Tools',
    metaTitle: 'CRE Leasing Automation Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} leasing automation tools for CRE. Marketing, tours, proposals, and vacancy reduction.',
    intro:
      'Leasing automation tools help landlords and brokers market space, qualify prospects, and produce proposals faster. AI generates listing copy, powers chatbots for initial inquiries, and prioritizes leads to shorten vacancy periods.',
    faqs: [
      { question: 'What is commercial leasing automation?', answer: 'Software for listing syndication, lead capture, tour scheduling, and proposal generation for available CRE space.' },
      { question: 'How does AI improve leasing?', answer: 'Faster collateral production, automated tenant FAQs, and lead scoring—not replacement of negotiation.' },
      { question: 'What asset types need different tools?', answer: 'Industrial, retail, and office often need different tour, spec, and deal-term workflows.' },
      { question: 'Should leasing connect to PM systems?', answer: 'Yes—executed leases should flow into property management without double entry.' },
    ],
    relatedCategorySlugs: ['marketing-leasing-enablement', 'transactions-brokerage'],
    relatedTagSlugs: ['transaction-management', 'property-management'],
    featureMatchers: ['leasing', 'lease marketing', 'tour', 'proposal', 'vacancy'],
  },
  {
    slug: 'data-integration',
    label: 'Data Integration',
    h1: 'CRE Data Integration & Workflow Automation Tools',
    metaTitle: 'CRE Data Integration Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} data integration tools for commercial real estate. Connect PM, accounting, CRM, and analytics.',
    intro:
      'Data integration tools connect siloed CRE systems—accounting, property management, CRM, and market data—into reliable pipelines. Clean, timely data is the prerequisite for accurate AI analytics and investor reporting.',
    faqs: [
      { question: 'Why do CRE teams need data integration?', answer: 'Manual exports break at scale; integration enforces consistent NOI, occupancy, and lease definitions across systems.' },
      { question: 'What should IT evaluate first?', answer: 'Source coverage, error monitoring, security certifications, and whether ops can configure flows without developers.' },
      { question: 'How does this relate to AI tools?', answer: 'Most CRE AI fails without structured inputs—integration fixes the plumbing first.' },
      { question: 'What is a good first integration project?', answer: 'Rent roll or GL sync for one property type before enterprise rollout.' },
    ],
    relatedCategorySlugs: ['data-workflow-infrastructure'],
    relatedTagSlugs: ['portfolio-analytics', 'real-estate-copilot'],
    featureMatchers: ['integration', 'api', 'etl', 'workflow', 'automation', 'data pipeline'],
  },
];

const tagBySlug = new Map(SEO_TAGS.map((t) => [t.slug, t]));

export function getSeoTag(slug: string): SeoTag | undefined {
  return tagBySlug.get(slug);
}

export function getAllSeoTags(): SeoTag[] {
  return SEO_TAGS;
}

export function getTagsForCategory(categorySlug: string): SeoTag[] {
  return SEO_TAGS.filter((t) => t.relatedCategorySlugs.includes(categorySlug));
}

export function getTopTagSlugs(limit = 6): string[] {
  return SEO_TAGS.slice(0, limit).map((t) => t.slug);
}
