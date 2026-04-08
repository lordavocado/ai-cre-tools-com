import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".cache");
const INPUT_PATH = path.join(CACHE_DIR, "aicretools-items.json");
const OUTPUT_TAXONOMY_PATH = path.join(CACHE_DIR, "tag-taxonomy-overview.json");
const OUTPUT_MAPPING_PATH = path.join(CACHE_DIR, "tool-tag-mapping.json");
const OUTPUT_CSV_PATH = path.join(CACHE_DIR, "tool-tag-mapping.csv");
const OUTPUT_REPORT_PATH = path.join(CACHE_DIR, "tool-tag-taxonomy-report.md");

if (!fs.existsSync(INPUT_PATH)) {
  throw new Error(
    `Missing input file at ${INPUT_PATH}. Fetch the live tools JSON first.`,
  );
}

const rawItems = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));

const TAXONOMY = [
  {
    slug: "property-search",
    label: "Property Search",
    group: "Discovery and market",
    description: "Tools for finding listings, opportunities, or properties through search-driven workflows.",
    patterns: [
      /property search/i,
      /home search/i,
      /listing search/i,
      /property discovery/i,
      /searchLand/i,
    ],
  },
  {
    slug: "natural-language-search",
    label: "Natural Language Search",
    group: "Discovery and market",
    description: "Tools that let users search or query real estate data with conversational prompts.",
    patterns: [
      /natural[- ]language search/i,
      /nlp quer/i,
      /chatgpt-style home search/i,
      /askgpt/i,
      /conversational quer/i,
      /pose location-specific questions/i,
    ],
  },
  {
    slug: "deal-sourcing",
    label: "Deal Sourcing",
    group: "Discovery and market",
    description: "Tools for finding, screening, and surfacing investable deal opportunities.",
    patterns: [
      /deal sourcing/i,
      /off-market/i,
      /deal screening/i,
      /deal discovery/i,
      /find investment opportunities/i,
      /prospecting/i,
    ],
  },
  {
    slug: "site-selection",
    label: "Site Selection",
    group: "Discovery and market",
    description: "Tools for comparing locations, trade areas, and sites for investment or development.",
    patterns: [
      /site selection/i,
      /location analysis/i,
      /location intelligence/i,
      /trade area/i,
      /site intelligence/i,
    ],
  },
  {
    slug: "location-intelligence",
    label: "Location Intelligence",
    group: "Discovery and market",
    description: "Tools that combine geospatial, mobility, or place data to understand locations.",
    patterns: [
      /location intelligence/i,
      /geospatial/i,
      /spatial analysis/i,
      /maps ai/i,
      /urban planning/i,
      /mobility/i,
    ],
  },
  {
    slug: "zoning-planning",
    label: "Zoning and Planning",
    group: "Discovery and market",
    description: "Tools for zoning, planning context, rezoning, and land-use intelligence.",
    patterns: [
      /zoning/i,
      /planning data/i,
      /rezoning/i,
      /planning and regulatory/i,
      /municipal meeting/i,
      /buildable units/i,
    ],
  },
  {
    slug: "market-analysis",
    label: "Market Analysis",
    group: "Discovery and market",
    description: "Tools for analyzing market conditions, demand, trends, and competitive context.",
    patterns: [
      /market analysis/i,
      /market analytics/i,
      /market intelligence/i,
      /market trends?/i,
      /market insights?/i,
      /competitive analysis/i,
      /policy sentiment/i,
      /early warning/i,
    ],
  },
  {
    slug: "comps",
    label: "Comps",
    group: "Discovery and market",
    description: "Tools for comparable-property analysis, comparable sales, or rent comps.",
    patterns: [
      /\bcomps?\b/i,
      /comparative market analysis/i,
      /comparable property/i,
      /rent comp/i,
      /live comps/i,
    ],
  },
  {
    slug: "property-reports",
    label: "Property Reports",
    group: "Discovery and market",
    description: "Tools that generate property-level reports, summaries, or packet outputs.",
    patterns: [
      /property reports?/i,
      /interactive reports?/i,
      /client-ready analytics/i,
      /report sharing/i,
      /generate reports?/i,
    ],
  },
  {
    slug: "valuation-avm",
    label: "Valuation and AVM",
    group: "Valuation and investment",
    description: "Tools for automated valuation models, appraisal support, or instant property values.",
    patterns: [
      /\bvaluation\b/i,
      /\bavm\b/i,
      /appraisal/i,
      /zestimate/i,
      /property value/i,
      /valuations?/i,
    ],
  },
  {
    slug: "underwriting",
    label: "Underwriting",
    group: "Valuation and investment",
    description: "Tools for underwriting models, OM parsing, rent-roll analysis, and lender-style investment evaluation.",
    patterns: [
      /underwriting/i,
      /financial model/i,
      /sources and uses/i,
      /debt sizing/i,
      /rent roll/i,
      /\bt-12\b/i,
      /\bdcf\b/i,
      /offering memorandum/i,
      /om extraction/i,
    ],
  },
  {
    slug: "investment-analysis",
    label: "Investment Analysis",
    group: "Valuation and investment",
    description: "Tools for evaluating returns, scenarios, or asset attractiveness as an investment.",
    patterns: [
      /investment analysis/i,
      /return projections/i,
      /yield calculations/i,
      /\bcap rate\b/i,
      /\broi\b/i,
      /cash flow analysis/i,
      /investment memor/i,
    ],
  },
  {
    slug: "cash-flow-analysis",
    label: "Cash Flow Analysis",
    group: "Valuation and investment",
    description: "Tools for projecting, analyzing, or extracting property cash-flow performance.",
    patterns: [/cash flow/i, /cash-flow/i],
  },
  {
    slug: "rent-roll-analysis",
    label: "Rent Roll Analysis",
    group: "Valuation and investment",
    description: "Tools that extract, analyze, or model rent-roll data.",
    patterns: [/rent roll/i],
  },
  {
    slug: "cap-rate-yield",
    label: "Cap Rate and Yield",
    group: "Valuation and investment",
    description: "Tools focused on cap rates, yields, or pricing returns.",
    patterns: [/\bcap rate\b/i, /\byield\b/i],
  },
  {
    slug: "scenario-analysis",
    label: "Scenario Analysis",
    group: "Valuation and investment",
    description: "Tools for sensitivity testing, scenario planning, or option comparison.",
    patterns: [/scenario analysis/i, /sensitivity/i, /what-if/i],
  },
  {
    slug: "predictive-analytics",
    label: "Predictive Analytics",
    group: "Valuation and investment",
    description: "Tools for forecasting, predictive scoring, or forward-looking analytics.",
    patterns: [
      /predictive analytics/i,
      /forecast/i,
      /prediction/i,
      /predictive/i,
      /forecasts/i,
    ],
  },
  {
    slug: "risk-scoring",
    label: "Risk Scoring",
    group: "Valuation and investment",
    description: "Tools for scoring, identifying, or quantifying risk.",
    patterns: [
      /risk scoring/i,
      /risk assessment/i,
      /risk analysis/i,
      /risk prediction/i,
      /risk factor/i,
      /hidden risk/i,
    ],
  },
  {
    slug: "portfolio-analytics",
    label: "Portfolio Analytics",
    group: "Valuation and investment",
    description: "Tools for portfolio-level monitoring, benchmarking, and asset strategy.",
    patterns: [
      /portfolio analytics/i,
      /portfolio monitoring/i,
      /portfolio performance/i,
      /portfolio strategy/i,
      /portfolio dashboards/i,
    ],
  },
  {
    slug: "document-extraction",
    label: "Document Extraction",
    group: "Legal and diligence",
    description: "Tools for OCR, extraction, parsing, or structuring data from CRE documents.",
    patterns: [
      /document extraction/i,
      /data extraction/i,
      /\bocr\b/i,
      /document processing/i,
      /document ai/i,
      /extract key terms/i,
      /document automation/i,
    ],
  },
  {
    slug: "lease-abstraction",
    label: "Lease Abstraction",
    group: "Legal and diligence",
    description: "Tools that abstract leases into structured summaries or databases.",
    patterns: [/lease abstraction/i, /lease abstract/i],
  },
  {
    slug: "contract-review",
    label: "Contract Review",
    group: "Legal and diligence",
    description: "Tools that review contracts, clauses, and legal documents.",
    patterns: [
      /contract review/i,
      /contract analysis/i,
      /clause/i,
      /legal document/i,
      /insurance policy review/i,
    ],
  },
  {
    slug: "due-diligence",
    label: "Due Diligence",
    group: "Legal and diligence",
    description: "Tools that surface diligence risks, red flags, or acquisition issues.",
    patterns: [/due diligence/i, /red flag/i, /deal breaker/i, /diligence/i],
  },
  {
    slug: "compliance-monitoring",
    label: "Compliance Monitoring",
    group: "Legal and diligence",
    description: "Tools for tracking and maintaining regulatory, lease, or operational compliance.",
    patterns: [
      /compliance/i,
      /regulatory/i,
      /policy management/i,
      /compliance tracking/i,
      /compliance automation/i,
    ],
  },
  {
    slug: "permit-compliance",
    label: "Permit Compliance",
    group: "Legal and diligence",
    description: "Tools for permitting, code checking, and development approvals.",
    patterns: [
      /permit/i,
      /code compliance/i,
      /permit assessment/i,
      /building permit/i,
      /approval process/i,
    ],
  },
  {
    slug: "title-closing",
    label: "Title and Closing",
    group: "Legal and diligence",
    description: "Tools that support title, settlement, exchange, or closing workflows.",
    patterns: [/title/i, /settlement/i, /closing/i, /1031/i, /qualified intermediary/i],
  },
  {
    slug: "legal-intelligence",
    label: "Legal Intelligence",
    group: "Legal and diligence",
    description: "Tools that make legal requirements or obligations easier to interpret and act on.",
    patterns: [/legal intelligence/i, /legal document translation/i, /plain language/i],
  },
  {
    slug: "crm",
    label: "CRM",
    group: "Leasing, brokerage, and transactions",
    description: "Tools with CRM, pipeline, or relationship-management functionality.",
    patterns: [/\bcrm\b/i, /pipeline management/i, /client relationship/i],
  },
  {
    slug: "lead-generation",
    label: "Lead Generation",
    group: "Leasing, brokerage, and transactions",
    description: "Tools for generating, qualifying, or capturing leads.",
    patterns: [
      /lead generation/i,
      /lead nurturing/i,
      /lead qualification/i,
      /lead scoring/i,
      /lead capture/i,
      /prospect follow-up/i,
    ],
  },
  {
    slug: "lead-qualification",
    label: "Lead Qualification",
    group: "Leasing, brokerage, and transactions",
    description: "Tools for ranking, scoring, or qualifying prospects.",
    patterns: [/lead qualification/i, /lead scoring/i, /prospect qualification/i],
  },
  {
    slug: "tour-scheduling",
    label: "Tour Scheduling",
    group: "Leasing, brokerage, and transactions",
    description: "Tools for booking tours, appointments, or self-guided showings.",
    patterns: [
      /tour/i,
      /appointment scheduling/i,
      /appointment booking/i,
      /self-guided/i,
      /schedule tours?/i,
    ],
  },
  {
    slug: "lender-matching",
    label: "Lender Matching",
    group: "Leasing, brokerage, and transactions",
    description: "Tools that connect deals to lenders or financing sources.",
    patterns: [/lender matching/i, /lenders/i, /mortgage/i, /\bloan/i, /bridge loans/i],
  },
  {
    slug: "transaction-management",
    label: "Transaction Management",
    group: "Leasing, brokerage, and transactions",
    description: "Tools that coordinate or automate transactions from LOI through close.",
    patterns: [
      /transaction assistant/i,
      /transaction coordination/i,
      /deal management/i,
      /guided self-closing/i,
      /closing process/i,
    ],
  },
  {
    slug: "proposal-generation",
    label: "Proposal Generation",
    group: "Leasing, brokerage, and transactions",
    description: "Tools for generating proposals, memoranda, or client-facing deal packages.",
    patterns: [/proposal/i, /investment memo/i, /memorand/i, /offer generation/i],
  },
  {
    slug: "financing-workflows",
    label: "Financing Workflows",
    group: "Leasing, brokerage, and transactions",
    description: "Tools for debt, financing, capital sourcing, or financing process automation.",
    patterns: [/financing/i, /mortgage/i, /\bloan/i, /capital/i, /funding/i],
  },
  {
    slug: "ai-assistants",
    label: "AI Assistants",
    group: "Operations and tenant experience",
    description: "Copilots, assistants, and AI agents that support users across workflows.",
    patterns: [
      /\bassistant\b/i,
      /\bcopilot\b/i,
      /ai agent/i,
      /always-on/i,
      /chatbot/i,
      /voice assistant/i,
    ],
  },
  {
    slug: "communications",
    label: "Communications",
    group: "Operations and tenant experience",
    description: "Tools for handling messages, voice, email, text, or omni-channel communication.",
    patterns: [
      /\bvoice\b/i,
      /\bphone\b/i,
      /\btext\b/i,
      /\bemail\b/i,
      /messaging/i,
      /\bchat\b/i,
      /omni-channel/i,
      /resident communication/i,
    ],
  },
  {
    slug: "tenant-communications",
    label: "Tenant Communications",
    group: "Operations and tenant experience",
    description: "Tools focused on tenant-facing support, updates, or issue handling.",
    patterns: [
      /tenant chat/i,
      /resident communication/i,
      /tenant queries/i,
      /tenant engagement/i,
      /property inquiry/i,
      /resident services/i,
    ],
  },
  {
    slug: "rent-collection",
    label: "Rent Collection",
    group: "Operations and tenant experience",
    description: "Tools for rent billing, reminders, or collection workflows.",
    patterns: [/rent collection/i, /rent-payment/i, /billing/i, /payment reminders/i],
  },
  {
    slug: "lease-renewals",
    label: "Lease Renewals",
    group: "Operations and tenant experience",
    description: "Tools for predicting, automating, or managing lease renewals.",
    patterns: [/lease renewal/i, /renewal forecasting/i, /predictive renewal/i, /renewals/i],
  },
  {
    slug: "maintenance",
    label: "Maintenance",
    group: "Operations and tenant experience",
    description: "Tools for maintenance requests, work orders, and service coordination.",
    patterns: [/maintenance/i, /work order/i, /service and maintenance/i, /technician matching/i],
  },
  {
    slug: "inspections",
    label: "Inspections",
    group: "Operations and tenant experience",
    description: "Tools for inspections, defect detection, or inspection reporting.",
    patterns: [/inspection/i, /defect detection/i, /remote inspections/i],
  },
  {
    slug: "tenant-screening",
    label: "Tenant Screening",
    group: "Operations and tenant experience",
    description: "Tools for screening and qualifying residents or renters.",
    patterns: [/tenant screening/i, /screening automation/i, /screening/i],
  },
  {
    slug: "fraud-detection",
    label: "Fraud Detection",
    group: "Operations and tenant experience",
    description: "Tools for fraud checks, synthetic identity detection, or payment/doc fraud.",
    patterns: [/fraud detection/i, /synthetic identities/i, /\bfraud\b/i, /pay stubs/i],
  },
  {
    slug: "energy-hvac",
    label: "Energy and HVAC",
    group: "Operations and tenant experience",
    description: "Tools for energy optimization, HVAC operations, and building utility management.",
    patterns: [/energy/i, /hvac/i, /utility/i, /air quality/i, /meters?/i],
  },
  {
    slug: "virtual-staging",
    label: "Virtual Staging",
    group: "Design, development, and construction",
    description: "Tools that stage, furnish, or reimagine spaces visually.",
    patterns: [/virtual staging/i, /\bstaging\b/i],
  },
  {
    slug: "image-enhancement",
    label: "Image Enhancement",
    group: "Design, development, and construction",
    description: "Tools for decluttering, enhancing, or editing listing imagery.",
    patterns: [/declutter/i, /image enhancement/i, /furniture replacement/i, /photo enhancement/i],
  },
  {
    slug: "interior-design",
    label: "Interior Design",
    group: "Design, development, and construction",
    description: "Tools that generate or support interior design concepts and layouts.",
    patterns: [/interior design/i, /room layouts/i, /design previews/i, /moodboard/i],
  },
  {
    slug: "3d-modeling",
    label: "3D Modeling",
    group: "Design, development, and construction",
    description: "Tools for 3D models, renders, scans, or immersive property visuals.",
    patterns: [
      /\b3d\b/i,
      /render/i,
      /photorealistic/i,
      /vr tours?/i,
      /floor-planner/i,
      /image-to-3d/i,
      /photo-to-3d/i,
      /point cloud/i,
    ],
  },
  {
    slug: "digital-twins",
    label: "Digital Twins",
    group: "Design, development, and construction",
    description: "Tools that create or use digital twins for buildings or systems.",
    patterns: [/digital twin/i],
  },
  {
    slug: "construction-monitoring",
    label: "Construction Monitoring",
    group: "Design, development, and construction",
    description: "Tools for tracking site progress, construction status, or field execution.",
    patterns: [
      /construction progress/i,
      /progress tracking/i,
      /site monitoring/i,
      /camera deployment/i,
      /field intelligence/i,
    ],
  },
  {
    slug: "bim",
    label: "BIM",
    group: "Design, development, and construction",
    description: "Tools that integrate BIM models or BIM-based workflows.",
    patterns: [/\bbim\b/i],
  },
  {
    slug: "autonomous-equipment",
    label: "Autonomous Equipment",
    group: "Design, development, and construction",
    description: "Tools for robotics, autonomy, or self-operating construction equipment.",
    patterns: [/autonomous/i, /robotic/i, /bulldozer/i, /excavator/i, /micro-factor/i],
  },
  {
    slug: "content-generation",
    label: "Content Generation",
    group: "Content, workflow, and infrastructure",
    description: "Tools for producing written or creative marketing content.",
    patterns: [
      /content generation/i,
      /content creation/i,
      /copywriting/i,
      /writing templates/i,
      /marketing content/i,
      /brand voice/i,
      /social media/i,
    ],
  },
  {
    slug: "property-descriptions",
    label: "Property Descriptions",
    group: "Content, workflow, and infrastructure",
    description: "Tools specifically for listing copy, property descriptions, or neighborhood guides.",
    patterns: [/property descriptions?/i, /listing descriptions?/i, /neighborhood guides/i],
  },
  {
    slug: "ad-creative",
    label: "Ad Creative",
    group: "Content, workflow, and infrastructure",
    description: "Tools for generating, scoring, or optimizing ad creatives and campaigns.",
    patterns: [/ad creative/i, /campaign/i, /creative generation/i],
  },
  {
    slug: "seo-content",
    label: "SEO Content",
    group: "Content, workflow, and infrastructure",
    description: "Tools for SEO optimization and search-oriented content creation.",
    patterns: [/\bseo\b/i, /search results/i],
  },
  {
    slug: "presentations",
    label: "Presentations",
    group: "Content, workflow, and infrastructure",
    description: "Tools for pitch decks, presentations, brochures, or marketing materials.",
    patterns: [/presentation/i, /deal deck/i, /brochure/i, /marketing materials/i],
  },
  {
    slug: "workflow-automation",
    label: "Workflow Automation",
    group: "Content, workflow, and infrastructure",
    description: "Tools that automate repetitive workflows or orchestrate task execution.",
    patterns: [
      /workflow automation/i,
      /task automation/i,
      /workflow builder/i,
      /automated workflows/i,
      /process automation/i,
      /route optimization/i,
    ],
  },
  {
    slug: "api-integrations",
    label: "API and Integrations",
    group: "Content, workflow, and infrastructure",
    description: "Tools with APIs, webhooks, connectors, or broad system integrations.",
    patterns: [/\bapi\b/i, /webhooks/i, /connectors/i, /integrations/i],
  },
  {
    slug: "no-code",
    label: "No-Code",
    group: "Content, workflow, and infrastructure",
    description: "Tools that emphasize no-code building, setup, or analytics.",
    patterns: [/no-code/i],
  },
  {
    slug: "excel",
    label: "Excel",
    group: "Content, workflow, and infrastructure",
    description: "Tools built around Excel, spreadsheets, or spreadsheet automation.",
    patterns: [/excel/i, /spreadsheet/i],
  },
  {
    slug: "reporting-dashboards",
    label: "Reporting and Dashboards",
    group: "Content, workflow, and infrastructure",
    description: "Tools for dashboards, recurring reporting, and visual operational analytics.",
    patterns: [/dashboard/i, /reporting/i, /report generation/i, /reports?/i],
  },
  {
    slug: "database-querying",
    label: "Database Querying",
    group: "Content, workflow, and infrastructure",
    description: "Tools for querying databases, generating SQL, or interacting with structured data.",
    patterns: [
      /\bsql\b/i,
      /database client/i,
      /query engine/i,
      /conversational querying/i,
      /natural language to sql/i,
    ],
  },
  {
    slug: "data-enrichment",
    label: "Data Enrichment",
    group: "Content, workflow, and infrastructure",
    description: "Tools that enrich or enhance data with additional signals or fields.",
    patterns: [/data enrichment/i, /column creation/i, /enrich/i],
  },
  {
    slug: "knowledge-base-rag",
    label: "Knowledge Base and RAG",
    group: "Content, workflow, and infrastructure",
    description: "Tools that use knowledge bases, retrieval, or RAG-style architectures.",
    patterns: [/knowledge base/i, /\brag\b/i, /trained on your business knowledge/i],
  },
  {
    slug: "research-citations",
    label: "Research and Citations",
    group: "Content, workflow, and infrastructure",
    description: "Tools that emphasize research support, traceability, citations, or auditable outputs.",
    patterns: [/citations/i, /\bcites\b/i, /auditable/i, /deep research/i, /research support/i],
  },
];

const GROUP_ORDER = [
  "Discovery and market",
  "Valuation and investment",
  "Legal and diligence",
  "Leasing, brokerage, and transactions",
  "Operations and tenant experience",
  "Design, development, and construction",
  "Content, workflow, and infrastructure",
];

const MANUAL_OVERRIDES = {
  "dreamoffice": ["interior-design", "3d-modeling", "presentations"],
  "eliseai": ["ai-assistants", "communications", "crm", "tour-scheduling", "lease-renewals", "rent-collection"],
  "prophia": ["lease-abstraction", "document-extraction", "portfolio-analytics"],
  "propmarker": ["deal-sourcing", "property-search", "investment-analysis", "property-reports", "zoning-planning"],
  "kolena-ai": ["document-extraction", "lease-abstraction", "cash-flow-analysis", "proposal-generation"],
  "endex": ["excel", "workflow-automation", "research-citations"],
  "archistar-ai": ["permit-compliance", "compliance-monitoring", "zoning-planning"],
  "property-inspect": ["inspections", "maintenance", "reporting-dashboards", "api-integrations"],
  "zillow-zestimate": ["valuation-avm", "predictive-analytics", "market-analysis"],
  "zipsmart-ai": ["valuation-avm", "market-analysis", "predictive-analytics", "property-reports"],
  "alt-x": ["underwriting", "excel", "research-citations", "cash-flow-analysis"],
};

const CATEGORY_FALLBACKS = {
  "property-search-acquisition": ["property-search", "deal-sourcing", "site-selection", "market-analysis"],
  "property-analysis-valuation": ["valuation-avm", "market-analysis", "predictive-analytics", "investment-analysis"],
  "development-construction": ["construction-monitoring", "permit-compliance", "3d-modeling", "site-selection"],
  "legal-compliance-due-diligence": ["document-extraction", "contract-review", "due-diligence", "compliance-monitoring"],
  "property-management-operations": ["ai-assistants", "communications", "maintenance", "tenant-communications"],
  "asset-portfolio-management": ["portfolio-analytics", "investment-analysis", "underwriting", "reporting-dashboards"],
  "transactions-brokerage": ["crm", "lead-generation", "transaction-management", "financing-workflows"],
  "marketing-leasing-enablement": ["content-generation", "presentations", "lead-generation", "property-descriptions"],
  "data-workflow-infrastructure": ["workflow-automation", "api-integrations", "reporting-dashboards", "database-querying"],
  "productivity-copilots": ["ai-assistants", "workflow-automation", "reporting-dashboards", "research-citations"],
};

const TAXONOMY_BY_SLUG = new Map(TAXONOMY.map((tag) => [tag.slug, tag]));

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getFeatureTexts(item) {
  return (item.features || [])
    .map((feature) => (typeof feature === "string" ? feature : feature?.name || ""))
    .filter(Boolean);
}

function scoreTag(tag, item) {
  const name = normalizeText(item.name);
  const tagline = normalizeText(item.tagline);
  const description = normalizeText(item.description);
  const features = getFeatureTexts(item).map(normalizeText);
  const fullText = [name, tagline, description, ...features].join(" | ");

  let score = 0;

  for (const pattern of tag.patterns) {
    if (pattern.test(name)) score += 5;
    if (pattern.test(tagline)) score += 4;
    if (pattern.test(description)) score += 2;
    if (features.some((feature) => pattern.test(feature))) score += 3;
    if (pattern.test(fullText)) score += 1;
  }

  return score;
}

function rankTags(item) {
  const ranked = TAXONOMY.map((tag) => ({
    tag: tag.slug,
    score: scoreTag(tag, item),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag));

  const chosen = ranked
    .filter((entry, index) => entry.score >= 4 || index < 4)
    .slice(0, 6)
    .map((entry) => entry.tag);

  const overrideTags = MANUAL_OVERRIDES[item.slug] || [];
  const merged = [...new Set([...overrideTags, ...chosen])];

  if (merged.length >= 2) {
    return merged.slice(0, 6);
  }

  const fallbackTags = CATEGORY_FALLBACKS[item.category.trim()] || [];
  for (const fallback of fallbackTags) {
    if (!merged.includes(fallback)) {
      merged.push(fallback);
    }
    if (merged.length >= 3) {
      break;
    }
  }

  return merged.slice(0, 6);
}

function buildTaxonomyOverview(items, mappings) {
  const toolCounts = new Map();

  for (const mapping of mappings) {
    for (const tag of mapping.tags) {
      toolCounts.set(tag, (toolCounts.get(tag) || 0) + 1);
    }
  }

  return GROUP_ORDER.map((group) => ({
    group,
    tags: TAXONOMY.filter((tag) => tag.group === group)
      .map((tag) => ({
        slug: tag.slug,
        label: tag.label,
        description: tag.description,
        toolCount: toolCounts.get(tag.slug) || 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }));
}

function buildCoverageSummary(mappings) {
  const toolCounts = new Map();
  const tagsPerTool = mappings.map((mapping) => mapping.tags.length);
  const groupCounts = new Map();

  for (const mapping of mappings) {
    for (const tag of mapping.tags) {
      toolCounts.set(tag, (toolCounts.get(tag) || 0) + 1);
      const group = TAXONOMY_BY_SLUG.get(tag)?.group;
      if (group) {
        groupCounts.set(group, (groupCounts.get(group) || 0) + 1);
      }
    }
  }

  const tagCounts = [...toolCounts.entries()]
    .map(([tag, count]) => ({
      slug: tag,
      label: TAXONOMY_BY_SLUG.get(tag)?.label || tag,
      group: TAXONOMY_BY_SLUG.get(tag)?.group || "Unknown",
      toolCount: count,
    }))
    .sort((a, b) => b.toolCount - a.toolCount || a.slug.localeCompare(b.slug));

  return {
    totalTools: mappings.length,
    totalTags: TAXONOMY.length,
    minTagsPerTool: Math.min(...tagsPerTool),
    maxTagsPerTool: Math.max(...tagsPerTool),
    avgTagsPerTool: Number(
      (tagsPerTool.reduce((sum, count) => sum + count, 0) / mappings.length).toFixed(2),
    ),
    thinTags: tagCounts.filter((tag) => tag.toolCount <= 2),
    topTags: tagCounts.slice(0, 15),
    tagsByGroup: GROUP_ORDER.map((group) => ({
      group,
      assignments: groupCounts.get(group) || 0,
    })),
  };
}

function toCsv(mappings) {
  const lines = [["slug", "name", "category", "tags"]];
  for (const mapping of mappings) {
    lines.push([
      mapping.slug,
      mapping.name,
      mapping.category,
      mapping.tags.join("|"),
    ]);
  }

  return lines
    .map((line) =>
      line
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
}

const mappings = rawItems
  .map((item) => ({
    slug: item.slug,
    name: item.name,
    category: item.category.trim(),
    tags: rankTags(item),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const taxonomyOverview = buildTaxonomyOverview(rawItems, mappings);
const coverageSummary = buildCoverageSummary(mappings);

const reportLines = [
  "# Tool Tags Taxonomy Overview",
  "",
  `Generated from ${rawItems.length} live tools on ${new Date().toISOString().slice(0, 10)}.`,
  "",
  "## Coverage Summary",
  "",
  `- Total tools: ${coverageSummary.totalTools}`,
  `- Total tags: ${coverageSummary.totalTags}`,
  `- Average tags per tool: ${coverageSummary.avgTagsPerTool}`,
  `- Minimum tags per tool: ${coverageSummary.minTagsPerTool}`,
  `- Maximum tags per tool: ${coverageSummary.maxTagsPerTool}`,
  "",
  "## Top Tags",
  "",
  ...coverageSummary.topTags.map(
    (tag) => `- ${tag.label} (\`${tag.slug}\`): ${tag.toolCount} tools`,
  ),
  "",
  "## Thin Tags",
  "",
  ...coverageSummary.thinTags.map(
    (tag) => `- ${tag.label} (\`${tag.slug}\`): ${tag.toolCount} tools`,
  ),
  "",
  "## Taxonomy",
  "",
];

for (const section of taxonomyOverview) {
  reportLines.push(`### ${section.group}`, "");
  for (const tag of section.tags) {
    reportLines.push(
      `- ${tag.label} (\`${tag.slug}\`): ${tag.description} Currently mapped to ${tag.toolCount} tools.`,
    );
  }
  reportLines.push("");
}

reportLines.push("## Tool Mapping", "");

for (const category of [...new Set(mappings.map((mapping) => mapping.category))].sort()) {
  reportLines.push(`### ${category}`, "");

  for (const mapping of mappings.filter((entry) => entry.category === category)) {
    reportLines.push(
      `- ${mapping.name} (\`${mapping.slug}\`): ${mapping.tags.join(", ")}`,
    );
  }

  reportLines.push("");
}

const outputPayload = {
  generatedAt: new Date().toISOString(),
  totalTools: rawItems.length,
  totalTags: TAXONOMY.length,
  taxonomy: taxonomyOverview,
  coverageSummary,
  mappings,
};

fs.mkdirSync(CACHE_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_TAXONOMY_PATH, JSON.stringify(taxonomyOverview, null, 2));
fs.writeFileSync(OUTPUT_MAPPING_PATH, JSON.stringify(outputPayload, null, 2));
fs.writeFileSync(OUTPUT_CSV_PATH, `${toCsv(mappings)}\n`);
fs.writeFileSync(OUTPUT_REPORT_PATH, `${reportLines.join("\n")}\n`);

console.log(
  JSON.stringify(
    {
      taxonomyPath: path.relative(ROOT, OUTPUT_TAXONOMY_PATH),
      mappingPath: path.relative(ROOT, OUTPUT_MAPPING_PATH),
      csvPath: path.relative(ROOT, OUTPUT_CSV_PATH),
      reportPath: path.relative(ROOT, OUTPUT_REPORT_PATH),
      coverageSummary,
    },
    null,
    2,
  ),
);
