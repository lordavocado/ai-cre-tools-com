import Link from 'next/link';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  'data-keyword'?: string;
}

export function InternalLink({ href, children, className = '', title, 'data-keyword': keyword }: InternalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      title={title}
      data-keyword={keyword}
    >
      {children}
    </Link>
  );
}

// Topic cluster linking components
export function AutomationLinks() {
  const links = [
    { href: '/categories/property-management-operations', text: 'property management automation', keyword: 'automate property management tasks' },
    { href: '/categories/development-construction', text: 'construction process automation', keyword: 'automate commercial real estate processes' },
    { href: '/categories/transactions-brokerage', text: 'transaction automation', keyword: 'commercial real estate efficiency tools' },
    { href: '/categories/legal-compliance-due-diligence', text: 'due diligence automation', keyword: 'AI for real estate due diligence' },
  ];

  return (
    <div className="internal-link-cluster">
      {links.map((link, index) => (
        <InternalLink
          key={index}
          href={link.href}
          className="text-blue-600 hover:text-blue-800 underline"
          data-keyword={link.keyword}
        >
          {link.text}
        </InternalLink>
      ))}
    </div>
  );
}

export function AnalysisLinks() {
  const links = [
    { href: '/categories/property-analysis-valuation', text: 'property valuation AI', keyword: 'AI real estate market analysis' },
    { href: '/categories/marketing-leasing-enablement', text: 'market analysis tools', keyword: 'AI real estate market analysis' },
    { href: '/categories/asset-portfolio-management', text: 'portfolio analysis', keyword: 'AI property risk assessment' },
    { href: '/categories/data-workflow-infrastructure', text: 'data analysis platforms', keyword: 'commercial real estate efficiency tools' },
  ];

  return (
    <div className="internal-link-cluster">
      {links.map((link, index) => (
        <InternalLink
          key={index}
          href={link.href}
          className="text-blue-600 hover:text-blue-800 underline"
          data-keyword={link.keyword}
        >
          {link.text}
        </InternalLink>
      ))}
    </div>
  );
}

export function CostReductionLinks() {
  const links = [
    { href: '/categories/property-management-operations', text: 'operational cost reduction', keyword: 'reduce CRE operational costs AI' },
    { href: '/categories/asset-portfolio-management', text: 'portfolio optimization', keyword: 'AI property risk assessment' },
    { href: '/categories/data-workflow-infrastructure', text: 'workflow efficiency', keyword: 'commercial real estate efficiency tools' },
    { href: '/categories/transactions-brokerage', text: 'transaction cost savings', keyword: 'reduce CRE operational costs AI' },
  ];

  return (
    <div className="internal-link-cluster">
      {links.map((link, index) => (
        <InternalLink
          key={index}
          href={link.href}
          className="text-blue-600 hover:text-blue-800 underline"
          data-keyword={link.keyword}
        >
          {link.text}
        </InternalLink>
      ))}
    </div>
  );
}

export function RiskAssessmentLinks() {
  const links = [
    { href: '/categories/property-analysis-valuation', text: 'property risk analysis', keyword: 'AI property risk assessment' },
    { href: '/categories/legal-compliance-due-diligence', text: 'compliance risk assessment', keyword: 'AI for real estate due diligence' },
    { href: '/categories/asset-portfolio-management', text: 'portfolio risk management', keyword: 'AI property risk assessment' },
    { href: '/categories/marketing-leasing-enablement', text: 'market risk evaluation', keyword: 'AI real estate market analysis' },
  ];

  return (
    <div className="internal-link-cluster">
      {links.map((link, index) => (
        <InternalLink
          key={index}
          href={link.href}
          className="text-blue-600 hover:text-blue-800 underline"
          data-keyword={link.keyword}
        >
          {link.text}
        </InternalLink>
      ))}
    </div>
  );
}

// Breadcrumb component for internal linking
interface BreadcrumbItem {
  name: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <InternalLink href="/" className="hover:text-blue-600">
        Home
      </InternalLink>
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="mx-2">/</span>
          {item.href && !item.isActive ? (
            <InternalLink href={item.href} className="hover:text-blue-600">
              {item.name}
            </InternalLink>
          ) : (
            <span className={item.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}>
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Related content component
interface RelatedContentProps {
  title: string;
  links: Array<{
    href: string;
    title: string;
    description: string;
    keyword: string;
  }>;
}

export function RelatedContent({ title, links }: RelatedContentProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid gap-4">
        {links.map((link, index) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4">
            <InternalLink
              href={link.href}
              className="text-blue-600 hover:text-blue-800 font-medium"
              data-keyword={link.keyword}
            >
              {link.title}
            </InternalLink>
            <p className="text-gray-600 text-sm mt-1">{link.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Footer internal linking
export function FooterLinks() {
  const linkGroups = [
    {
      title: 'Automation Solutions',
      links: [
        { href: '/categories/property-management-operations', text: 'Property Management', keyword: 'automate property management tasks' },
        { href: '/categories/transactions-brokerage', text: 'Transaction Automation', keyword: 'automate commercial real estate processes' },
        { href: '/categories/data-workflow-infrastructure', text: 'Workflow Tools', keyword: 'commercial real estate efficiency tools' },
      ]
    },
    {
      title: 'Analysis & Insights',
      links: [
        { href: '/categories/property-analysis-valuation', text: 'Property Analysis', keyword: 'AI real estate market analysis' },
        { href: '/categories/marketing-leasing-enablement', text: 'Market Intelligence', keyword: 'AI real estate market analysis' },
        { href: '/categories/asset-portfolio-management', text: 'Portfolio Management', keyword: 'AI property risk assessment' },
      ]
    },
    {
      title: 'Risk & Compliance',
      links: [
        { href: '/categories/legal-compliance-due-diligence', text: 'Due Diligence', keyword: 'AI for real estate due diligence' },
        { href: '/categories/property-analysis-valuation', text: 'Risk Assessment', keyword: 'AI property risk assessment' },
        { href: '/categories/legal-compliance-due-diligence', text: 'Compliance Tools', keyword: 'AI commercial lease analysis' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {linkGroups.map((group, index) => (
        <div key={index}>
          <h4 className="font-semibold text-gray-900 mb-4">{group.title}</h4>
          <ul className="space-y-2">
            {group.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <InternalLink
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  data-keyword={link.keyword}
                >
                  {link.text}
                </InternalLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
