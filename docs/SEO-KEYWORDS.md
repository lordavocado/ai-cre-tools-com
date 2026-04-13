# SEO Keywords Source of Truth

Last updated: 2026-03-05
Owner: Growth / SEO
Target market: US commercial real estate professionals

## Purpose
This document is the single source of truth for SEO keyword targeting across:
- Homepage (`/`)
- Category pages (`/categories/[slug]`)
- Tool pages (`/[slug]`)
- Supporting content (blog/internal linking)

Any SEO or content change must map to one of these clusters and intents.

## Intent Labels
- `commercial_investigational`: user is researching solutions and workflows.
- `comparison`: user is comparing tools/providers.
- `transactional`: user is evaluating software purchase/selection.

## Priority Tiers
- `P1`: primary commercial terms with strongest business relevance.
- `P2`: supporting long-tail workflow terms.
- `P3`: emerging/experimental terms to monitor and test.

## Canonical Phrasing Rules (US B2B CRE)
- Prefer `commercial real estate` over generic `real estate` unless the query is explicitly generic.
- Prefer `software`, `tools`, `platform`, `comparison`, `for [role]` phrasing.
- Use role terms: `investors`, `developers`, `brokers`, `asset managers`, `property managers`, `operators`.
- Avoid consumer-style language (home buyers, agents for residential consumers, Zillow-like wording).

## Keyword Clusters

### 1) Investor Cluster
Intent: `commercial_investigational`, `comparison`, `transactional`

#### P1
- ai for real estate investors
- ai tools for real estate investors
- commercial real estate investment analysis software
- commercial real estate ai underwriting

#### P2
- real estate ai underwriting
- ai real estate underwriting software
- real estate due diligence software
- commercial real estate due diligence software

#### P3
- ai software for real estate investors
- best ai for real estate investors

### 2) Developer Cluster
Intent: `commercial_investigational`, `comparison`

#### P1
- ai for real estate developers
- ai tools for real estate developers
- ai for commercial real estate developers
- real estate development management software

#### P2
- construction project management ai tools
- ai for construction project management
- real estate site selection software

#### P3
- best ai tools for real estate developers

### 3) Underwriting & Diligence Cluster
Intent: `comparison`, `transactional`

#### P1
- commercial real estate underwriting software
- commercial real estate ai underwriting
- real estate due diligence software
- commercial real estate due diligence software
- lease abstraction ai software

#### P2
- lease abstraction ai tool
- lease abstraction using ai
- contract analysis software real estate

#### P3
- ai lease abstraction free

### 4) Operations & Portfolio Cluster
Intent: `commercial_investigational`, `comparison`, `transactional`

#### P1
- property management ai software
- ai for property management companies
- commercial real estate portfolio management software

#### P2
- real estate portfolio management software
- ai commercial property management software
- real estate valuation software commercial

#### P3
- best ai property management software

### 5) Brokerage & Leasing Cluster
Intent: `comparison`, `transactional`

#### P1
- commercial real estate ai tools
- commercial real estate transaction management software
- commercial real estate brokerage crm
- commercial real estate leasing software

#### P2
- best crm for commercial real estate brokerage
- commercial leasing software
- transaction automation for commercial real estate

#### P3
- ai tools for commercial real estate brokers

### 6) Emerging Cluster
Intent: `commercial_investigational`

#### P1
- real estate copilot
- ai copilot for real estate

#### P2
- real estate agentic ai
- agentic ai for real estate
- argus enterprise alternatives

#### P3
- agentic ai real estate leads

## Target Page Mapping

### Homepage (`/`)
Primary focus:
- commercial real estate ai tools
- ai tools for real estate investors
- ai tools for real estate developers
- commercial real estate software comparison intent

Secondary support:
- underwriting, due diligence, portfolio management, transaction management phrases

### Category Pages (`/categories/[slug]`)
- `property-search-acquisition`: deal sourcing, site selection, acquisitions workflow software
- `property-analysis-valuation`: valuation software, investment analysis software, market analysis workflows
- `development-construction`: real estate development management software, construction project management AI
- `legal-compliance-due-diligence`: due diligence software, lease abstraction AI, compliance workflow software
- `property-management-operations`: property management AI software, tenant/operations workflow automation
- `asset-portfolio-management`: commercial real estate portfolio management software, asset management AI
- `transactions-brokerage`: transaction management software, brokerage CRM, deal workflow software
- `marketing-leasing-enablement`: commercial leasing software, leasing enablement workflows
- `data-workflow-infrastructure`: real estate data integration/automation software
- `productivity-copilots`: real estate copilot, AI copilot for real estate professionals

### Tool Pages (`/[slug]`)
Primary focus:
- tool brand + category workflow phrase + comparison intent
- e.g. `[Tool] + commercial real estate underwriting software + comparison/review`

Secondary support:
- role modifiers (for investors/developers/operators) where relevant to the tool category.

## Do Not Target (unless explicitly approved)
- Residential consumer queries (`first-time home buyer`, `mortgage rates for buyers`, etc.)
- Local intent unrelated to B2B software buying
- Low-commercial informational terms with no software intent
- Purely academic keywords without product evaluation intent

## Internal Linking Anchor Guidelines
Use anchor text from approved cluster phrasing only. Preferred anchors include:
- commercial real estate underwriting software
- real estate due diligence software
- lease abstraction ai software
- property management ai software
- commercial real estate portfolio management software
- commercial real estate transaction management software
- commercial real estate brokerage crm
- ai tools for real estate investors
- ai tools for real estate developers

## Maintenance Protocol

### Monthly Refresh Cycle
- Week 1: pull Search Console query/page data for previous 28 days.
- Week 1: update winners/losers by cluster in `SEO-RANKING-TRACKER.md`.
- Week 2: adjust metadata/internal links for underperforming clusters.
- Week 4: log all keyword additions/removals below.

### Add/Remove Criteria
Add keyword only if at least one is true:
- appears in Search Console with relevant impressions/clicks
- appears in SERP autosuggest for core cluster phrases
- matches commercial software evaluation intent for CRE professionals

Remove/deprioritize keyword if:
- sustained zero relevant impressions after 90 days
- intent mismatch (consumer or off-topic)
- creates cannibalization with a stronger primary term

## Changelog
- 2026-03-05: Initial source-of-truth created for homepage/category/tool SEO alignment.
