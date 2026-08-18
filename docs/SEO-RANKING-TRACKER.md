# SEO Ranking Tracker

Owner: Growth / SEO
Cadence: Weekly checks, monthly iteration
Primary window: 90-day trend

## KPI Definitions
- Primary: Growth in target keyword coverage within Top-20 and non-brand clicks.
- Secondary: CTR improvement on homepage, category pages, and tool pages.
- Guardrails: No indexation regression, no canonical conflicts, no sitemap URL errors.

## Weekly Scorecard Template

| Week (ISO) | Cluster | Target Keywords | Top-20 Count | Avg Position | Impressions | Clicks | CTR | Primary Landing Pages | Winners | Losers | Notes |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---|
| 2026-W10 | Investor | 8 | 0 | - | 0 | 0 | 0% | /, /for/investors, /categories/asset-portfolio-management | - | - | Baseline |
| 2026-W24 | All pSEO | 40+ | - | - | - | - | - | /tags/*, /compare/*, /glossary/*, /tools/[slug]/alternatives | - | - | pSEO 100% rollout baseline |

## Cluster Mapping
- Investor → `/for/investors`, `/categories/property-search-acquisition`, `/categories/property-analysis-valuation`, `/tags/underwriting`, `/tags/deal-sourcing`
- Developer → `/for/developers`, `/categories/development-construction`, `/tags/construction-management`
- Underwriting & Diligence → `/categories/legal-compliance-due-diligence`, `/tags/lease-abstraction`, `/tags/due-diligence`, `/glossary/lease-abstraction`
- Operations & Portfolio → `/for/asset-managers`, `/for/property-managers`, `/categories/asset-portfolio-management`, `/tags/portfolio-analytics`
- Brokerage & Leasing → `/for/brokers`, `/categories/transactions-brokerage`, `/tags/leasing-automation`, `/tags/transaction-management`
- Emerging → `/tags/real-estate-copilot`, `/glossary/cre-copilot`, `/compare/*`

## Programmatic Landing Page Types (track separately)

| Page type | Hub URL | Index gate | Example URLs |
|---|---|---|---|
| Personas | `/for/*` | Config only | `/for/investors`, `/for/brokers` |
| Categories | `/categories/*` | DB category | `/categories/property-analysis-valuation` |
| Tags | `/tags` | ≥3 matching tools | `/tags/lease-abstraction`, `/tags/underwriting` |
| Alternatives | — | ≥3 same-category alts | `/tools/[tool-slug]/alternatives` |
| Comparisons | `/compare` | Curated + both tools resolve | `/compare/diligence-tools-leaders` |
| Glossary | `/glossary` | Config only | `/glossary/cap-rate`, `/glossary/noi` |

## Page-Level Review Template (Monthly)

### Homepage (`/`)
- Primary terms targeted:
- Current top queries:
- CTR trend:
- Next actions:

### Category Pages
- Highest-performing category page:
- Lowest-performing category page:
- Cannibalization observations:
- Next actions:

### Tag Pages (`/tags/*`)
- Highest-impression tag landing page:
- Tags below index threshold (noindex / omitted from sitemap):
- Next actions:

### Persona Pages (`/for/*`)
- Highest-performing persona hub:
- Next actions:

### Alternatives & Comparisons
- Top `/tools/[slug]/alternatives` pages by impressions:
- Top `/compare/[pair]` pages by impressions:
- Next actions:

### Glossary (`/glossary/*`)
- Terms with rising impressions:
- Next actions:

### Tool Pages
- Highest-performing tool pages:
- Metadata uniqueness check:
- Internal linking coverage check (tags, alternatives, category):
- Next actions:

## Technical SEO QA Checklist (Run Monthly)
- [ ] Sitemap includes valid canonical URLs for tools, categories, personas, tags, comparisons, glossary, and alternatives.
- [ ] No mismatched/legacy category slugs in internal links.
- [ ] Canonical tags are present and self-referencing on key page types.
- [ ] Filter/search URLs (`/?search=`, `/?category=`) use `noindex, follow`.
- [ ] Pagination URLs (`?page=N`) self-canonical without noindex.
- [ ] Structured data validates for homepage, category, persona, tag, comparison, glossary, and tool templates.
- [ ] No feature-as-FAQ schema on tool pages.

## Action Log

| Date | Change Type | Pages Affected | Expected Impact | Owner | Follow-up Date |
|---|---|---|---|---|---|
| 2026-03-05 | Baseline tracker created | All SEO templates | Establish operating cadence | Growth / SEO | 2026-04-05 |
| 2026-06-11 | pSEO 100% rollout | Tags, compare, glossary, alternatives, cross-links | Expand long-tail coverage and internal linking | Growth / SEO | 2026-07-11 |
