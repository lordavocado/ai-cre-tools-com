/**
 * Glossary terms for CRE + AI programmatic SEO pages.
 */

import type { SeoFaq } from '@/config/seo-clusters';

export interface SeoGlossaryTerm {
  slug: string;
  term: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  definition: string;
  faqs: SeoFaq[];
  relatedTagSlugs: string[];
  relatedCategorySlugs: string[];
}

const GLOSSARY_TERMS: SeoGlossaryTerm[] = [
  {
    slug: 'lease-abstraction',
    term: 'Lease Abstraction',
    h1: 'What Is Lease Abstraction in Commercial Real Estate?',
    metaTitle: 'Lease Abstraction Definition | AI CRE Tools Glossary',
    metaDescription:
      'Lease abstraction extracts key commercial lease terms into structured data. Learn how AI accelerates CRE diligence and portfolio onboarding.',
    definition:
      'Lease abstraction is the process of reading commercial lease documents and recording critical economic and legal terms—base rent, escalations, options, co-tenancy, termination rights, and recoveries—in a structured format analysts and asset managers can query. In acquisitions, abstracted leases feed underwriting models and estoppel coordination. In portfolio management, abstracts power critical-date tracking and rent-roll reconciliation. AI lease abstraction automates first-pass extraction from PDFs so professionals review exceptions instead of typing every clause manually. Accuracy still requires human validation on material terms before IC or investor reporting.',
    faqs: [
      { question: 'Why does lease abstraction matter in CRE?', answer: 'Underwriting and asset management depend on accurate lease economics; manual abstraction is slow and error-prone at scale.' },
    ],
    relatedTagSlugs: ['lease-abstraction', 'due-diligence'],
    relatedCategorySlugs: ['legal-compliance-due-diligence'],
  },
  {
    slug: 'ai-underwriting',
    term: 'AI Underwriting',
    h1: 'What Is AI Underwriting in Commercial Real Estate?',
    metaTitle: 'AI Underwriting Definition | AI CRE Tools Glossary',
    metaDescription:
      'AI underwriting uses machine learning to speed CRE investment analysis, rent-roll intake, and financial modeling.',
    definition:
      'AI underwriting in commercial real estate refers to software that applies artificial intelligence to accelerate investment analysis—ingesting offering memoranda and rent rolls, normalizing assumptions, flagging inconsistencies, and drafting financial model inputs. It does not replace investment judgment on growth, exit cap rates, or business plans. Instead, it reduces manual data entry and standardizes outputs across deal teams. Investors and analysts use AI underwriting to screen more deals and spend committee time on judgment calls rather than spreadsheet mechanics.',
    faqs: [
      { question: 'Is AI underwriting the same as automated valuation?', answer: 'Related but distinct—underwriting models cash flows for a specific deal; valuation may emphasize market comps and appraisal standards.' },
    ],
    relatedTagSlugs: ['underwriting', 'property-valuation'],
    relatedCategorySlugs: ['property-analysis-valuation'],
  },
  {
    slug: 'due-diligence',
    term: 'Due Diligence',
    h1: 'What Is Commercial Real Estate Due Diligence?',
    metaTitle: 'CRE Due Diligence Definition | AI CRE Tools Glossary',
    metaDescription:
      'CRE due diligence is the investigation phase before closing. Learn how AI tools speed document review and risk identification.',
    definition:
      'Commercial real estate due diligence is the comprehensive investigation buyers, lenders, and equity partners conduct before closing a transaction. It spans financial, legal, physical, and environmental workstreams—lease review, title, surveys, environmental reports, service contracts, and operating data validation. AI due diligence tools organize checklists, extract data from documents, and surface anomalies earlier in the timeline. Effective diligence reduces post-close surprises and supports accurate final pricing or re-trade negotiations.',
    faqs: [
      { question: 'Who leads CRE due diligence?', answer: 'Investors and lenders coordinate legal, environmental, and technical consultants; software coordinates workflows and document intake.' },
    ],
    relatedTagSlugs: ['due-diligence', 'lease-abstraction'],
    relatedCategorySlugs: ['legal-compliance-due-diligence'],
  },
  {
    slug: 'deal-sourcing',
    term: 'Deal Sourcing',
    h1: 'What Is CRE Deal Sourcing?',
    metaTitle: 'CRE Deal Sourcing Definition | AI CRE Tools Glossary',
    metaDescription:
      'Deal sourcing is how CRE investors and brokers find acquisition opportunities. Learn how AI improves pipeline building.',
    definition:
      'Deal sourcing in commercial real estate is the process of identifying and prioritizing acquisition or investment opportunities—on-market listings, off-market owners, and development sites. Teams use data platforms, broker relationships, and AI matching to build pipelines aligned with fund strategy. AI deal sourcing tools filter large property and ownership datasets, send alerts on relevant signals, and reduce time spent on manual market scans. Sourcing quality directly affects fund performance because the best underwriting cannot fix a weak acquisition thesis.',
    faqs: [
      { question: 'How is deal sourcing different from underwriting?', answer: 'Sourcing finds opportunities; underwriting evaluates whether to pursue them at a given price.' },
    ],
    relatedTagSlugs: ['deal-sourcing', 'market-analysis'],
    relatedCategorySlugs: ['property-search-acquisition'],
  },
  {
    slug: 'cap-rate',
    term: 'Cap Rate',
    h1: 'What Is a Cap Rate in Commercial Real Estate?',
    metaTitle: 'Cap Rate Definition | AI CRE Tools Glossary',
    metaDescription:
      'Cap rate (capitalization rate) measures CRE yield. Learn how AI valuation tools use cap rates in investment analysis.',
    definition:
      'Capitalization rate (cap rate) is a standard metric in commercial real estate defined as net operating income divided by property value or purchase price. Investors use cap rates to compare assets and markets, implicit in yield when financing is not considered. AI valuation and underwriting tools calculate and stress cap rates across scenarios, but analysts must ensure NOI inputs reflect sustainable operations—not temporary anomalies. Cap rate compression or expansion signals changing investor return requirements in a market.',
    faqs: [
      { question: 'Do AI tools replace cap rate judgment?', answer: 'No—they accelerate NOI builds and comp selection; exit and going-in cap assumptions remain human decisions.' },
    ],
    relatedTagSlugs: ['property-valuation', 'underwriting'],
    relatedCategorySlugs: ['property-analysis-valuation'],
  },
  {
    slug: 'noi',
    term: 'NOI',
    h1: 'What Is NOI in Commercial Real Estate?',
    metaTitle: 'NOI Definition | AI CRE Tools Glossary',
    metaDescription:
      'Net Operating Income (NOI) is core to CRE valuation. Learn how AI tools automate NOI analysis from rent rolls.',
    definition:
      'Net Operating Income (NOI) is a property\'s revenue minus operating expenses, excluding debt service, capital expenditures, and income taxes. NOI drives cap rates, DSCR lender tests, and asset valuations across asset classes. AI tools extract rent-roll and operating statement data to compute NOI faster and flag anomalies—vacancy spikes, recoveries mismatches, or one-time expenses—that distort trailing performance. Accurate NOI is the foundation of both underwriting and ongoing asset management reporting.',
    faqs: [
      { question: 'Is NOI the same as cash flow?', answer: 'NOI excludes debt and major capex; cash flow after financing may differ materially.' },
    ],
    relatedTagSlugs: ['underwriting', 'portfolio-analytics'],
    relatedCategorySlugs: ['property-analysis-valuation', 'asset-portfolio-management'],
  },
  {
    slug: 'rent-roll',
    term: 'Rent Roll',
    h1: 'What Is a Rent Roll in CRE?',
    metaTitle: 'Rent Roll Definition | AI CRE Tools Glossary',
    metaDescription:
      'A rent roll lists tenant leases and income for a commercial property. Learn how AI parses rent rolls for underwriting.',
    definition:
      'A rent roll is a summary of tenants, leased square footage, rent amounts, lease start and end dates, and often recoveries for a commercial property. Underwriters, asset managers, and lenders rely on rent rolls to validate income and rollover exposure. AI document tools parse rent rolls from Excel or PDF into structured data for models and abstracts, reducing manual transcription errors during acquisitions and refinancings. Rent roll quality directly affects NOI and valuation outputs.',
    faqs: [
      { question: 'Why do AI tools focus on rent rolls?', answer: 'They are the highest-volume structured input in CRE underwriting and portfolio reporting.' },
    ],
    relatedTagSlugs: ['underwriting', 'lease-administration'],
    relatedCategorySlugs: ['property-analysis-valuation'],
  },
  {
    slug: 'proptech',
    term: 'PropTech',
    h1: 'What Is PropTech in Commercial Real Estate?',
    metaTitle: 'PropTech Definition | AI CRE Tools Glossary',
    metaDescription:
      'PropTech is technology for real estate. Learn how AI PropTech tools fit CRE investor and operator workflows.',
    definition:
      'PropTech (property technology) describes software and hardware that digitizes real estate workflows—from investment analysis and construction to property management and tenant experience. In commercial real estate, PropTech adoption accelerated with cloud data, APIs, and AI that automate document-heavy tasks. CRE teams evaluate PropTech on integration with existing stacks, ROI on specific workflows, and change management—not novelty alone. AI CRE Tools directory focuses on PropTech products with meaningful AI capabilities for B2B commercial workflows.',
    faqs: [
      { question: 'Is every CRE software PropTech?', answer: 'The term usually applies to newer digital platforms; legacy accounting and PM systems are often excluded from marketing labels but remain critical.' },
    ],
    relatedTagSlugs: ['data-integration', 'real-estate-copilot'],
    relatedCategorySlugs: ['data-workflow-infrastructure'],
  },
  {
    slug: 'cre-copilot',
    term: 'CRE Copilot',
    h1: 'What Is a CRE AI Copilot?',
    metaTitle: 'CRE Copilot Definition | AI CRE Tools Glossary',
    metaDescription:
      'A CRE copilot is an AI assistant for commercial real estate work. Learn use cases and how to evaluate copilot tools.',
    definition:
      'A CRE AI copilot is an assistant that helps commercial real estate professionals with research, writing, summarization, and light analysis across daily tasks—drafting emails, summarizing offering memoranda, answering portfolio questions, and preparing meeting notes. Unlike vertical software that owns a full workflow (lease abstraction, PM ticketing), copilots span tools and reduce context switching. Teams should evaluate data security, connector quality, and whether outputs require human review before client or investor distribution.',
    faqs: [
      { question: 'Can a copilot replace specialized CRE software?', answer: 'No for regulated or high-stakes workflows; copilots complement vertical tools for general productivity.' },
    ],
    relatedTagSlugs: ['real-estate-copilot'],
    relatedCategorySlugs: ['productivity-copilots'],
  },
  {
    slug: 'portfolio-management',
    term: 'Portfolio Management',
    h1: 'What Is CRE Portfolio Management?',
    metaTitle: 'CRE Portfolio Management Definition | AI CRE Tools Glossary',
    metaDescription:
      'Portfolio management oversees multiple CRE assets for performance and risk. Learn how AI supports asset managers.',
    definition:
      'Commercial real estate portfolio management is the ongoing oversight of multiple properties or funds—tracking NOI, lease rollover, capex, dispositions, and performance against business plans. Asset managers coordinate property managers, report to investors, and recommend hold/sell/refinance decisions. AI portfolio tools aggregate data, benchmark assets, and draft reporting narratives. Effective portfolio management requires clean data feeds from property management and accounting systems underlying any analytics layer.',
    faqs: [
      { question: 'When do owners need portfolio management software?', answer: 'Often at 10+ assets or when LP reporting requires consolidated, audit-ready analytics.' },
    ],
    relatedTagSlugs: ['portfolio-analytics'],
    relatedCategorySlugs: ['asset-portfolio-management'],
  },
  {
    slug: 'tenant-improvements',
    term: 'Tenant Improvements',
    h1: 'What Are Tenant Improvements (TI) in CRE?',
    metaTitle: 'Tenant Improvements Definition | AI CRE Tools Glossary',
    metaDescription:
      'Tenant improvements (TI) are buildouts for commercial tenants. Learn how leasing and PM software tracks TI allowances.',
    definition:
      'Tenant improvements (TI) are customized buildouts landlords or tenants fund to make commercial space usable for a specific occupant—office layouts, industrial docks, retail storefronts. Leases specify TI allowances, delivery conditions, and who manages construction. Leasing and property management software tracks TI budgets, work letters, and handoff to operations. AI assists with lease clause extraction on TI obligations and with project coordination on larger repositioning programs.',
    faqs: [
      { question: 'How do TI allowances affect underwriting?', answer: 'Upfront TI costs and amortization affect yield; models should reflect negotiated packages, not generic assumptions.' },
    ],
    relatedTagSlugs: ['leasing-automation', 'property-management'],
    relatedCategorySlugs: ['marketing-leasing-enablement', 'property-management-operations'],
  },
  {
    slug: 'commercial-leasing',
    term: 'Commercial Leasing',
    h1: 'What Is Commercial Leasing?',
    metaTitle: 'Commercial Leasing Definition | AI CRE Tools Glossary',
    metaDescription:
      'Commercial leasing is marketing space and negotiating CRE leases. Learn how AI speeds leasing workflows.',
    definition:
      'Commercial leasing is the process of marketing available space, qualifying tenants, negotiating economic and legal terms, and executing leases for income-producing properties. Brokers and landlord reps use CRM, marketing, tour, and proposal tools; AI accelerates collateral creation, lead response, and comp research. Effective leasing reduces vacancy duration and improves tenant fit—directly impacting property NOI and value. Leasing software should connect to property management for seamless post-signing administration.',
    faqs: [
      { question: 'How does AI help commercial leasing?', answer: 'Faster listing copy, chatbots for initial inquiries, and lead prioritization—not replacement of negotiation.' },
    ],
    relatedTagSlugs: ['leasing-automation', 'transaction-management'],
    relatedCategorySlugs: ['marketing-leasing-enablement', 'transactions-brokerage'],
  },
];

const termBySlug = new Map(GLOSSARY_TERMS.map((t) => [t.slug, t]));

export function getGlossaryTerm(slug: string): SeoGlossaryTerm | undefined {
  return termBySlug.get(slug);
}

export function getAllGlossaryTerms(): SeoGlossaryTerm[] {
  return GLOSSARY_TERMS;
}

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_TERMS.map((t) => t.slug);
}
