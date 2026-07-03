# AI CRE Tools Directory Application

This is a powerful, fully-featured **directory/marketplace application** built with Next.js, TypeScript, and Firebase. It's designed to showcase and compare Commercial Real Estate AI tools and solutions through a modern, SEO-optimized interface.

**Currently configured for:** AI CRE Tools  
**Can be adapted for:** Any AI-powered tools or solutions within the Commercial Real Estate sector.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see Environment Setup section)
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:9002` to see your directory in action.

## 🔄 **How to Transform This Into a New Directory Type**

This application is built to be easily adaptable to any product category. Here's your complete transformation guide:

### **1. 🎯 Site Configuration & Branding**

**Primary File:** `src/config/site.ts`

This is your command center for global changes:

```typescript
export const siteConfig = {
  // 🏷️ MAIN CATEGORY - Changes the entire site focus
  categoryName: "AI Writing Tools", // Change this!
  
  // 📝 SITE METADATA
  name: "AI Writing Tools",
  description: "Find and compare the best AI writing tools...",
  url: "https://aiwritingtools.com",
  
  // 🔍 SEO KEYWORDS - Critical for discoverability
  seo: {
    primaryKeywords: [
      'ai writing tools',
      'ai content generation',
      'automated writing software',
      // Add 5-10 primary keywords for your niche
    ],
    secondaryKeywords: [
      'best ai writers',
      'content creation tools',
      'writing automation',
      // Add 15-20 long-tail keywords
    ],
  }
}
```

**What to Change:**
- ✅ `categoryName`: Your new directory focus (e.g., "CRM Software", "Design Tools")
- ✅ All metadata: title, description, URL
- ✅ Keywords: Research and add niche-specific terms
- ✅ Social handles: Update Twitter/LinkedIn usernames
- ✅ Hero messaging: Customize value propositions

### **2. 📊 Data Structure & Google Sheets Setup**

**Primary File:** `src/lib/sheets.ts`

#### **A. Sheet Configuration**
```typescript
const SHEET_NAMES = {
  ITEMS: 'your-tools-sheet-name',    // Main products/tools
  NEWSLETTER: 'Newsletter',           // Email subscriptions
};
```

#### **B. Column Mapping (Critical!)**
Map your Google Sheet columns to the application fields:

```typescript
const COLUMN_MAPPINGS = {
  ITEMS: {
    ID: 'id',                    // Unique identifier
    NAME: 'tool_name',           // Display name
    TAGLINE: 'tagline',          // Short catchphrase
    DESCRIPTION: 'description',   // Main description
    CATEGORY_SLUG: 'category',   // Category (must match categories)
    WEBSITE: 'website_url',      // Official website
    IMAGE_URL: 'logo_url',       // Logo/icon URL
    FEATURES_JSON: 'features',   // JSON array of features
    PRICING: 'pricing_model',    // Pricing information
    RATING: 'user_rating',       // Numerical rating (1-5)
    // Add more fields as needed
  }
};
```

#### **C. Required Google Sheet Columns**

**Essential Columns** (must have):
- `id` - Unique identifier (e.g., "chatgpt", "notion")
- `tool_name` - Display name (e.g., "ChatGPT", "Notion")
- `tagline` - Brief hook (e.g., "AI conversational assistant")
- `description` - Main description (2-3 sentences)
- `category` - Category slug (must match your categories)
- `website_url` - Official website
- `logo_url` - Logo/icon image URL

**Optional but Recommended:**
- `features` - JSON array: `[{"name": "Feature 1"}, {"name": "Feature 2"}]`
- `pricing_model` - "Free", "Freemium", "$10/month", etc.
- `user_rating` - Number between 1-5
- `best_for` - Use case description
- `tags` - Comma-separated tags

### **3. 🗂️ Categories Definition**

**Primary File:** `src/lib/sheets.ts` (HARDCODED_CATEGORIES section)

Replace the existing categories with your niche categories:

```typescript
const HARDCODED_CATEGORIES: Category[] = [
  {
    id: 'property-valuation',
    slug: 'property-valuation',
    name: 'Property Valuation',
    description: 'AI tools for accurate property appraisal and market analysis',
    longDescription: `
      <div class="space-y-6">
        <p>Comprehensive property valuation tools that help...</p>
        <!-- Add rich HTML description -->
      </div>
    `,
    imageUrl: '/property-valuation.png',
    icon: Activity, // Choose from Lucide icons
  },
  // Add 5-8 categories for your niche
];
```

**Category Planning Template:**
- **CRE AI Tools**: Property Valuation, Investment Analysis, Market Research, Property Management, Leasing & Sales

### **4. 🎨 UI/UX Customization**

#### **A. Main Landing Page** (`src/app/page.tsx`)
- Update hero messaging in the Hero component
- Modify section titles and descriptions
- Adjust featured categories display

#### **B. Visual Assets**
Replace these files in the `public/` directory:
- `favicon.ico` - Browser tab icon
- `logo.png` - Main logo
- `og-image.png` - Social sharing image (1200x630)
- `twitter-image.png` - Twitter card image
- Category images (match your imageUrl paths)

#### **C. Color Scheme** (`src/app/globals.css`)
Customize the CSS variables to match your brand:
```css
:root {
  --primary: 210 40% 58%;     /* Main brand color */
  --secondary: 210 40% 98%;   /* Light background */
  --accent: 210 40% 30%;      /* Dark accent */
  /* Adjust as needed */
}
```

### **5. 📝 Content Customization**

#### **A. Navigation** (`src/config/site.ts`)
```typescript
nav: {
  items: [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Browse Tools' }, // Customize labels
  ]
}
```

#### **B. Footer Content**
Update footer messaging in `src/config/site.ts`:
```typescript
footer: {
  description: "Discover the best {categoryName} for your business needs",
  copyright: "© 2024 Your Directory Name. All rights reserved.",
}
```

#### **C. Legal Pages**
Update these files with your content:
- `src/app/privacy-policy/page.tsx` - Privacy policy
- `src/app/terms-of-service/page.tsx` - Terms of service

### **6. 🔍 SEO Optimization**

#### **A. Metadata Templates** (`src/config/site.ts`)
Customize SEO templates for your niche:
```typescript
categoryMetaTemplates: {
  title: "Best {categoryName} Tools 2024 - Compare Features & Pricing",
  description: "Find the perfect {categoryName} solution. Compare features, pricing, and reviews of top {categoryName} tools.",
}
```

#### **B. Structured Data**
The app automatically generates structured data for:
- ✅ Organization schema
- ✅ WebSite schema with search functionality
- ✅ ItemList for directory items
- ✅ SoftwareApplication for individual tools

### **7. 🚀 Deployment & Environment**

#### **A. Environment Variables** (`.env.local`)
```env
# Google Sheets (Required)
GOOGLE_SHEET_ID="your-sheet-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Mailchimp Newsletter (Optional)
MAILCHIMP_API_KEY="your-api-key"
MAILCHIMP_LIST_ID="your-list-id"

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

#### **B. Deployment (Coolify)**
Production deploys via **Coolify** on Hetzner using the repo `Dockerfile` (Next.js standalone, port 3000).

1. Push to `master` on GitHub — the Coolify webhook rebuilds the app.
2. Set environment variables in the Coolify application (see `docs/ENVIRONMENT_VARIABLES.md`).
3. Domains: `aicretools.com`, `www.aicretools.com` (Cloudflare → Coolify/Traefik).

Local Docker smoke test:
```bash
docker build -t ai-cre-tools-com .
docker run --rm -p 3000:3000 --env-file .env.local ai-cre-tools-com
```

### **8. ⚙️ Advanced Features**

#### **A. Newsletter Integration**
Mailchimp integration is pre-configured:
- Automatic subscriber management
- Tag-based segmentation
- Double opt-in support
- GDPR compliance features

#### **B. Analytics Integration**
Built-in PostHog integration for:
- User behavior tracking
- Conversion analytics
- A/B testing capabilities
- Feature flag management

#### **C. AI-Powered Features**
GenKit integration provides:
- Automatic tool comparisons
- Content suggestions
- Smart categorization
- SEO optimization hints

### **9. 📋 Launch Checklist**

**Before Going Live:**
- [ ] Update all site configuration in `src/config/site.ts`
- [ ] Set up Google Sheets with proper column mappings
- [ ] Define and implement your categories
- [ ] Replace all visual assets (logos, images, icons)
- [ ] Customize color scheme and branding
- [ ] Update legal pages (privacy, terms, about)
- [ ] Configure environment variables
- [ ] Set up analytics and monitoring
- [ ] Test all functionality (search, filtering, newsletter)
- [ ] Verify SEO metadata across all pages
- [ ] Set up domain and SSL certificate
- [ ] Submit sitemap to search engines

**Post-Launch:**
- [ ] Monitor Google Search Console for indexing
- [ ] Set up Google Analytics goals
- [ ] Configure email automation
- [ ] Create content marketing strategy
- [ ] Plan feature updates and improvements

## 🛠️ **Development Commands**

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Production build
npm run start           # Start production server

# AI/GenKit Development
npm run genkit:dev      # Start GenKit development
npm run genkit:watch    # Start GenKit with file watching

# Quality Assurance
npm run lint            # ESLint check
npm run typecheck       # TypeScript validation
```

## 📁 **Project Structure**

```
src/
├── app/                # Next.js 15 App Router
│   ├── page.tsx       # Homepage with directory listing
│   ├── [slug]/        # Individual tool pages
│   ├── categories/    # Category browsing
│   ├── guides/        # Content/blog section
│   └── api/          # API routes (newsletter, etc.)
├── components/        # Reusable UI components
│   ├── listing/      # Directory grid and search
│   ├── category/     # Category cards and pages
│   └── ui/          # shadcn/ui components
├── config/           # Site configuration
├── lib/              # Utilities and data fetching
├── types/            # TypeScript definitions
└── hooks/            # Custom React hooks
```

## 🔧 **Technical Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Source**: Google Sheets API
- **Newsletter**: Mailchimp integration
- **Analytics**: PostHog (optional)
- **AI Features**: Google GenKit
- **Deployment**: Coolify (Docker / Hetzner)

## 📖 **Additional Documentation**

- `ENVIRONMENT_SETUP.md` - Detailed environment configuration
- `CONFIG_GUIDE.md` - Complete configuration reference
- `PAGES_CMS_GUIDE.md` - Content management guidelines
- `SECURITY.md` - Security best practices

## 🆘 **Need Help?**

This is a production-ready directory application that can be adapted to any niche. The modular architecture makes it easy to customize while maintaining professional functionality.

**Common Adaptations:**
- 🤖 AI Tools Directory
- 📈 Marketing Tools Marketplace
- 💼 Business Software Directory
- 🏠 Real Estate Platform

The application scales from hundreds to thousands of listings while maintaining fast performance and excellent SEO.

---

*Built with ❤️ using Next.js, TypeScript, and modern web standards*
```

