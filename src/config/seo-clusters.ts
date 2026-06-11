/**
 * SEO cluster config per category slug.
 * Single source of truth for category page metadata, H1s, FAQs, and internal linking.
 * Aligned with docs/SEO-KEYWORDS.md — supersedes generateCategoryMeta() in site.ts.
 */

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoCluster {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faqs: SeoFaq[];
  personaSlugs: string[];
  relatedCategorySlugs: string[];
}

const SEO_CLUSTERS: SeoCluster[] = [
  {
    slug: 'property-search-acquisition',
    primaryKeyword: 'real estate deal sourcing software',
    secondaryKeywords: [
      'real estate site selection software',
      'commercial real estate acquisition tools',
      'ai property search commercial',
    ],
    h1: 'Best CRE Deal Sourcing & Acquisition Software',
    metaTitle: 'CRE Deal Sourcing Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI deal sourcing tools for commercial real estate. Site selection, off-market discovery, and acquisition workflows.',
    intro:
      'Commercial real estate teams use AI-powered deal sourcing software to scan markets, identify off-market opportunities, and prioritize acquisitions faster than manual research allows. These platforms combine property data, predictive signals, and workflow automation so investors and brokers act on the right deals first.',
    faqs: [
      {
        question: 'What is commercial real estate deal sourcing software?',
        answer:
          'Deal sourcing software helps CRE professionals discover, filter, and prioritize acquisition opportunities using property databases, market signals, and AI matching. It replaces scattered spreadsheets and manual list-building with a centralized pipeline from site selection through initial underwriting.',
      },
      {
        question: 'Who benefits most from AI property search tools?',
        answer:
          'Investors, acquisition analysts, and brokerage teams evaluating new markets benefit most. Occupiers running site selection and developers scouting land also use these tools to shorten research cycles and surface opportunities competitors may miss.',
      },
      {
        question: 'How do I evaluate deal sourcing platforms?',
        answer:
          'Compare data coverage for your target asset classes and geographies, integration with your CRM or underwriting stack, alert quality for new listings, and whether the tool supports off-market or proprietary deal flow—not just public MLS-style data.',
      },
      {
        question: 'Can deal sourcing tools integrate with underwriting workflows?',
        answer:
          'Many platforms export deal packages or connect to analysis and due diligence tools. Look for API access, standard export formats, and whether the vendor supports your asset class (office, industrial, multifamily, retail) before committing.',
      },
    ],
    personaSlugs: ['investors', 'brokers', 'developers'],
    relatedCategorySlugs: [
      'property-analysis-valuation',
      'legal-compliance-due-diligence',
      'transactions-brokerage',
    ],
  },
  {
    slug: 'property-analysis-valuation',
    primaryKeyword: 'commercial real estate investment analysis software',
    secondaryKeywords: [
      'commercial real estate ai underwriting',
      'real estate valuation software commercial',
      'cre financial modeling tools',
    ],
    h1: 'Best CRE Investment Analysis & Valuation Software',
    metaTitle: 'CRE Investment Analysis Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI valuation and investment analysis tools for commercial real estate. Underwriting, modeling, and market analytics.',
    intro:
      'Investment analysis and valuation software gives CRE teams consistent underwriting, automated comps, and scenario modeling without rebuilding spreadsheets for every deal. AI layers add faster rent-roll parsing, market trend signals, and risk flags that help investors and analysts move from LOI to IC memo with fewer manual steps.',
    faqs: [
      {
        question: 'What is commercial real estate investment analysis software?',
        answer:
          'These platforms automate financial modeling, valuation, and market analysis for CRE assets. They typically support cash-flow projections, sensitivity analysis, comp selection, and reporting formats investment committees expect—often with AI-assisted data extraction from offering memos and rent rolls.',
      },
      {
        question: 'How is AI underwriting different from traditional spreadsheets?',
        answer:
          'AI underwriting tools ingest unstructured deal documents, normalize assumptions, and flag inconsistencies faster than manual review. They do not replace judgment on exit cap rates or business plans, but they reduce time on data entry and standardize outputs across a deal team.',
      },
      {
        question: 'What should investors look for in valuation software?',
        answer:
          'Prioritize asset-class support, auditability of assumptions, export to your IC template, and data sources for comps and market rents. Teams with multiple analysts should also evaluate collaboration, version history, and integration with your data room or CRM.',
      },
      {
        question: 'Do these tools work for institutional and mid-market deals?',
        answer:
          'Most vendors scale from single-asset acquisitions to portfolio-level analysis, but depth varies. Confirm the platform handles your typical deal size, debt structures, and whether it supports value-add, core, or development scenarios before rollout.',
      },
    ],
    personaSlugs: ['investors', 'asset-managers', 'developers'],
    relatedCategorySlugs: [
      'property-search-acquisition',
      'asset-portfolio-management',
      'legal-compliance-due-diligence',
    ],
  },
  {
    slug: 'development-construction',
    primaryKeyword: 'real estate development management software',
    secondaryKeywords: [
      'construction project management ai tools',
      'ai for construction project management',
      'cre development feasibility tools',
    ],
    h1: 'Best CRE Development & Construction Management Software',
    metaTitle: 'CRE Development Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI development and construction tools for commercial real estate. Project planning, cost control, and delivery workflows.',
    intro:
      'Development and construction software helps CRE developers and GC partners coordinate schedules, budgets, permits, and field progress on complex projects. AI-assisted tools improve cost forecasting, document coordination, and risk detection early—when change orders are still avoidable.',
    faqs: [
      {
        question: 'What does real estate development management software cover?',
        answer:
          'These tools span feasibility, budgeting, scheduling, contractor coordination, permit tracking, and progress reporting from pre-development through certificate of occupancy. AI features often target takeoff assistance, schedule risk, and automated status summaries for stakeholders.',
      },
      {
        question: 'How can AI help construction project management in CRE?',
        answer:
          'AI can flag schedule drift, surface RFIs that block critical path, and compare actuals to budget by cost code. The value is earlier visibility into overruns—not replacing supers or project managers, but giving them fewer surprises at monthly draws.',
      },
      {
        question: 'Should developers prioritize feasibility or field tools first?',
        answer:
          'Teams with frequent new starts should prioritize feasibility and pro forma integration; active builders with multiple sites often need field and contractor collaboration first. Many stacks combine a development platform with a separate scheduling or document tool.',
      },
      {
        question: 'What integrations matter for development software?',
        answer:
          'Look for connections to accounting, pro forma models, BIM or drawing repositories, and owner reporting. Export to lender draw packages and investor updates saves significant admin time across a development portfolio.',
      },
    ],
    personaSlugs: ['developers', 'operators'],
    relatedCategorySlugs: [
      'property-analysis-valuation',
      'legal-compliance-due-diligence',
      'data-workflow-infrastructure',
    ],
  },
  {
    slug: 'legal-compliance-due-diligence',
    primaryKeyword: 'commercial real estate due diligence software',
    secondaryKeywords: [
      'lease abstraction ai software',
      'real estate due diligence software',
      'contract analysis software real estate',
    ],
    h1: 'Best CRE Due Diligence & Lease Abstraction Software',
    metaTitle: 'CRE Due Diligence Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI due diligence and lease abstraction tools for commercial real estate. Contract review, compliance, and document workflows.',
    intro:
      'Due diligence and lease abstraction software accelerates document-heavy phases of CRE transactions—rent rolls, leases, environmental reports, and compliance checks. AI extraction turns PDF stacks into structured data attorneys and analysts can review in hours instead of weeks, reducing closing risk and legal spend.',
    faqs: [
      {
        question: 'What is lease abstraction AI software?',
        answer:
          'Lease abstraction tools use AI to pull key terms—rent, escalations, options, co-tenancy, termination—from lease PDFs into structured fields. Analysts review and correct extractions rather than typing every clause manually, which speeds acquisitions and portfolio onboarding.',
      },
      {
        question: 'When should teams use due diligence software vs. law firms alone?',
        answer:
          'Software handles volume and first-pass review; counsel still signs off on material terms and structure. The best outcomes combine AI document processing with attorney oversight on exceptions, estoppels, and title issues the model cannot resolve.',
      },
      {
        question: 'What document types should a CRE diligence platform support?',
        answer:
          'Prioritize leases, amendments, SNDAs, environmental Phase I/II summaries, title commitments, and service contracts for your asset class. Multifamily teams may need different templates than office or industrial investors.',
      },
      {
        question: 'How accurate is AI contract analysis for real estate?',
        answer:
          'Accuracy depends on document quality and vendor training data. Always plan for human review of critical fields, audit trails for changes, and a pilot on a closed deal set before relying on outputs for live transactions.',
      },
    ],
    personaSlugs: ['investors', 'asset-managers', 'brokers'],
    relatedCategorySlugs: [
      'property-analysis-valuation',
      'transactions-brokerage',
      'property-management-operations',
    ],
  },
  {
    slug: 'property-management-operations',
    primaryKeyword: 'property management ai software',
    secondaryKeywords: [
      'ai for property management companies',
      'ai commercial property management software',
      'cre operations automation',
    ],
    h1: 'Best Commercial Property Management AI Software',
    metaTitle: 'Property Management AI Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI property management tools for commercial real estate. Tenant ops, maintenance, leasing admin, and reporting.',
    intro:
      'Property management AI software automates tenant communication, work orders, lease administration, and operating reports for commercial portfolios. Operators use these platforms to reduce response times, standardize service across assets, and free on-site teams for higher-value tenant relationships.',
    faqs: [
      {
        question: 'What is property management AI software for commercial real estate?',
        answer:
          'These platforms apply AI to tenant inquiries, maintenance triage, lease reminders, and operating data synthesis. Unlike residential PM apps, CRE-focused tools handle complex leases, CAM reconciliations, and multi-tenant buildings with varied use types.',
      },
      {
        question: 'What workflows see the fastest ROI from AI in property management?',
        answer:
          'Tenant service ticketing, lease abstract lookups, rent roll anomalies, and preventive maintenance scheduling often show quick wins. Teams drowning in email and phone requests benefit before attempting full portfolio analytics automation.',
      },
      {
        question: 'How do I choose PM software for a mixed portfolio?',
        answer:
          'Confirm support for your property types (office, retail, industrial), accounting integration, mobile access for engineers, and whether AI features are included or priced separately. Pilot one building before portfolio-wide rollout.',
      },
      {
        question: 'Can property management AI replace on-site staff?',
        answer:
          'No—these tools augment staff by handling routine requests and surfacing priorities. Tenant relationships, vendor negotiations, and capital projects still need experienced property managers; AI reduces admin load so they can focus there.',
      },
    ],
    personaSlugs: ['property-managers', 'operators', 'asset-managers'],
    relatedCategorySlugs: [
      'marketing-leasing-enablement',
      'asset-portfolio-management',
      'productivity-copilots',
    ],
  },
  {
    slug: 'asset-portfolio-management',
    primaryKeyword: 'commercial real estate portfolio management software',
    secondaryKeywords: [
      'real estate portfolio management software',
      'cre asset management ai',
      'portfolio performance analytics cre',
    ],
    h1: 'Best CRE Portfolio & Asset Management Software',
    metaTitle: 'CRE Portfolio Management Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI portfolio and asset management tools for commercial real estate. Performance tracking, risk, and capital planning.',
    intro:
      'Portfolio and asset management software gives institutional and private CRE owners a single view of performance, risk, and capital needs across holdings. AI highlights NOI drift, lease rollover exposure, and benchmarking gaps so asset managers prioritize interventions before they hit investor reports.',
    faqs: [
      {
        question: 'What is commercial real estate portfolio management software?',
        answer:
          'These systems aggregate property-level financials, leases, and KPIs into portfolio dashboards for asset managers and investors. They support budgeting, variance analysis, disposition planning, and often connect to accounting and property management source systems.',
      },
      {
        question: 'How does AI improve asset management workflows?',
        answer:
          'AI can flag underperforming assets against peer sets, predict rollover risk, and automate narrative summaries for quarterly reports. The goal is faster insight across many assets—not replacing asset manager strategy on hold/sell/refinance decisions.',
      },
      {
        question: 'What should asset managers require in a platform?',
        answer:
          'Data ingestion from your PM and accounting stack, flexible reporting for LPs or boards, scenario modeling for capex and refinancing, and role-based access for property vs. portfolio teams. Validate historical data migration before go-live.',
      },
      {
        question: 'Is portfolio software only for large institutions?',
        answer:
          'Mid-market owners with 10+ assets often benefit from centralized reporting even if they lack a full asset management department. Smaller holders may start with spreadsheets but hit limits when investor reporting and debt covenants require audit-ready rollups.',
      },
    ],
    personaSlugs: ['asset-managers', 'investors', 'operators'],
    relatedCategorySlugs: [
      'property-analysis-valuation',
      'property-management-operations',
      'data-workflow-infrastructure',
    ],
  },
  {
    slug: 'transactions-brokerage',
    primaryKeyword: 'commercial real estate transaction management software',
    secondaryKeywords: [
      'commercial real estate brokerage crm',
      'best crm for commercial real estate brokerage',
      'transaction automation for commercial real estate',
    ],
    h1: 'Best CRE Transaction Management & Brokerage CRM Software',
    metaTitle: 'CRE Transaction Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI transaction and brokerage CRM tools for commercial real estate. Deal pipeline, client management, and closings.',
    intro:
      'Transaction management and brokerage CRM software keeps CRE deals, contacts, and documents organized from pitch through closing. AI assists with comp research, proposal drafts, and follow-up reminders so brokers spend more time with clients and less on admin across active listings and buyer mandates.',
    faqs: [
      {
        question: 'What is commercial real estate transaction management software?',
        answer:
          'These platforms track deal stages, parties, deadlines, and documents for brokerage and investment sales teams. They often include CRM, pipeline reporting, and integrations with data rooms, marketing tools, and commission accounting.',
      },
      {
        question: 'How is a CRE brokerage CRM different from generic CRM?',
        answer:
          'CRE CRMs understand properties, spaces, commissions, and co-broker splits—not just contacts and tasks. They map to how brokers work: listings, tours, LOIs, and closing checklists tied to specific assets and deal teams.',
      },
      {
        question: 'What should brokers evaluate in transaction software?',
        answer:
          'Mobile access for touring, marketing integration, comp and market data links, and whether the tool supports your deal types (investment sales, leasing, debt). Team adoption matters more than feature count—pick something reps will actually log activity into.',
      },
      {
        question: 'Can AI help with brokerage productivity?',
        answer:
          'AI can draft OMs and emails, summarize market news for client touchpoints, and suggest follow-ups on stale deals. Verify outputs before client-facing use and ensure your compliance policy allows AI-generated marketing content.',
      },
    ],
    personaSlugs: ['brokers', 'investors'],
    relatedCategorySlugs: [
      'marketing-leasing-enablement',
      'property-search-acquisition',
      'legal-compliance-due-diligence',
    ],
  },
  {
    slug: 'marketing-leasing-enablement',
    primaryKeyword: 'commercial real estate leasing software',
    secondaryKeywords: [
      'commercial leasing software',
      'cre marketing automation',
      'leasing enablement tools',
    ],
    h1: 'Best Commercial Real Estate Leasing & Marketing Software',
    metaTitle: 'CRE Leasing Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI leasing and marketing tools for commercial real estate. Tenant prospecting, tours, proposals, and vacancy reduction.',
    intro:
      'Leasing and marketing enablement software helps landlords and brokers fill space faster with better collateral, lead qualification, and tour experiences. AI generates listing copy, virtual staging concepts, and prospect scoring so teams convert more inquiries into signed leases with shorter vacancy periods.',
    faqs: [
      {
        question: 'What is commercial real estate leasing software?',
        answer:
          'Leasing platforms support listing syndication, lead capture, tour scheduling, proposal generation, and pipeline reporting for available space. CRE-focused tools handle complex deal terms, TI allowances, and multi-suite buildings unlike residential listing apps.',
      },
      {
        question: 'How does AI improve CRE marketing and leasing?',
        answer:
          'AI accelerates brochure and email creation, powers chatbots for initial tenant questions, and ranks leads by fit and urgency. It does not replace brokers on negotiation—it reduces time producing materials and responding to repetitive inquiries.',
      },
      {
        question: 'What should landlords prioritize in leasing tools?',
        answer:
          'Integration with your stack (CRM, PM, accounting), analytics on channel performance, and support for your asset types. Industrial and retail often need different tour and spec workflows than Class A office.',
      },
      {
        question: 'Can leasing software connect to property management systems?',
        answer:
          'Many vendors offer APIs or native integrations to push executed leases, tenant data, and commencement dates into PM systems. Confirm bidirectional sync before rollout to avoid double entry after lease signing.',
      },
    ],
    personaSlugs: ['brokers', 'property-managers', 'operators'],
    relatedCategorySlugs: [
      'transactions-brokerage',
      'property-management-operations',
      'productivity-copilots',
    ],
  },
  {
    slug: 'data-workflow-infrastructure',
    primaryKeyword: 'real estate data integration software',
    secondaryKeywords: [
      'cre workflow automation',
      'real estate data analytics infrastructure',
      'proptech data pipeline tools',
    ],
    h1: 'Best CRE Data & Workflow Infrastructure Software',
    metaTitle: 'CRE Data Integration Software (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} data and workflow tools for commercial real estate. Integrations, automation, and analytics infrastructure.',
    intro:
      'Data and workflow infrastructure tools connect siloed CRE systems—accounting, PM, CRM, and market data—into reliable pipelines analysts and operators can trust. Automation and AI reduce manual exports, reconcile mismatched fields, and keep portfolio reporting current without overnight spreadsheet jobs.',
    faqs: [
      {
        question: 'What is real estate data integration software?',
        answer:
          'These platforms ETL data between CRE applications, normalize property and lease identifiers, and expose APIs or warehouses for reporting. They sit beneath analytics, investor portals, and AI tools that need clean, timely inputs.',
      },
      {
        question: 'Why do CRE teams need workflow automation beyond spreadsheets?',
        answer:
          'Manual exports break when deal volume grows, staff change, or investors expect near-real-time dashboards. Automation enforces consistent definitions of NOI, occupancy, and rollover across assets—reducing errors in board and LP reporting.',
      },
      {
        question: 'What should IT and ops evaluate in infrastructure tools?',
        answer:
          'Source system coverage, error handling and monitoring, security certifications, and whether business users can configure flows without developers. Pilot on one data domain (e.g., rent roll sync) before enterprise rollout.',
      },
      {
        question: 'How does this category relate to AI tools?',
        answer:
          'Most AI features in CRE depend on structured, current data. Infrastructure tools do not replace vertical AI apps—they make them accurate by fixing the plumbing first.',
      },
    ],
    personaSlugs: ['operators', 'asset-managers', 'investors'],
    relatedCategorySlugs: [
      'asset-portfolio-management',
      'property-analysis-valuation',
      'productivity-copilots',
    ],
  },
  {
    slug: 'productivity-copilots',
    primaryKeyword: 'ai copilot for real estate',
    secondaryKeywords: [
      'real estate copilot',
      'cre productivity ai tools',
      'agentic ai for real estate',
    ],
    h1: 'Best AI Copilots for Commercial Real Estate Teams',
    metaTitle: 'CRE AI Copilot Tools (2026) | AI CRE Tools',
    metaDescription:
      'Compare {toolCount} AI copilots and productivity tools for commercial real estate. Research, documents, and daily workflow assistance.',
    intro:
      'CRE productivity copilots act as AI assistants across research, document drafting, meeting notes, and task automation for deal teams. Unlike single-workflow apps, copilots augment generalist roles—investors, brokers, and operators—who juggle memos, emails, and data pulls throughout the week.',
    faqs: [
      {
        question: 'What is an AI copilot for commercial real estate?',
        answer:
          'A CRE copilot is an AI assistant trained or configured for real estate workflows—summarizing OM sections, drafting emails, answering portfolio questions, or pulling metrics from connected systems. It reduces context-switching between ChatGPT tabs and your actual deal stack.',
      },
      {
        question: 'How are copilots different from vertical CRE software?',
        answer:
          'Vertical tools own a workflow end-to-end (e.g., lease abstraction). Copilots span tasks: research, writing, and light analysis across tools. Many teams use both—a copilot for daily productivity and specialized apps for transaction-critical steps.',
      },
      {
        question: 'What security concerns apply to CRE copilots?',
        answer:
          'Deal data is confidential. Evaluate data retention policies, enterprise SSO, whether prompts train public models, and SOC 2 or equivalent certifications before uploading offering memos or rent rolls.',
      },
      {
        question: 'Who gets the most value from real estate copilots?',
        answer:
          'Generalists at lean firms—investment associates, brokerage coordinators, and owner-operators without dedicated analysts—often see immediate time savings. Larger firms may standardize copilots with approved prompts and data connectors.',
      },
    ],
    personaSlugs: ['operators', 'investors', 'brokers'],
    relatedCategorySlugs: [
      'data-workflow-infrastructure',
      'property-analysis-valuation',
      'transactions-brokerage',
    ],
  },
];

const clusterBySlug = new Map(SEO_CLUSTERS.map((c) => [c.slug, c]));

export function interpolateSeoText(
  text: string,
  vars: Record<string, string | number>
): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

export function getSeoCluster(slug: string): SeoCluster | undefined {
  return clusterBySlug.get(slug);
}

export function getAllSeoClusterSlugs(): string[] {
  return SEO_CLUSTERS.map((c) => c.slug);
}

export function getAllSeoClusters(): SeoCluster[] {
  return SEO_CLUSTERS;
}
