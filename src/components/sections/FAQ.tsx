import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";

const faqData = [
  {
    question: "What are product analytics tools?",
    answer: `Product analytics tools are software platforms that help businesses track, measure, and analyze user behavior and product performance. They provide insights into how users interact with your product, which features are most popular, where users drop off, and what drives conversions. These tools are essential for data-driven product decisions and optimization.`
  },
  {
    question: "Which product analytics tool is best for beginners?",
    answer: `For beginners, Google Analytics 4 is often the best starting point as it's free, widely supported, and has extensive documentation. Mixpanel and Amplitude also offer excellent free tiers with user-friendly interfaces. Choose based on your specific needs: GA4 for web analytics, Mixpanel for event tracking, or PostHog for an open-source solution.`
  },
  {
    question: "What's the difference between web analytics and product analytics?",
    answer: `Web analytics focuses on website traffic, page views, and marketing metrics, while product analytics dives deeper into user behavior within your product. Product analytics tracks feature usage, user journeys, retention, and engagement patterns. It's more focused on understanding how users interact with your product's functionality rather than just tracking visits.`
  },
  {
    question: "Do I need coding skills to implement product analytics?",
    answer: `While basic tracking can often be set up without coding, most product analytics tools benefit from some technical implementation. Many tools offer no-code solutions for basic tracking, but custom events and advanced tracking usually require developer assistance. Our guides provide step-by-step instructions for both technical and non-technical implementations.`
  },
  {
    question: "How much do product analytics tools typically cost?",
    answer: `Costs vary widely depending on your needs. Free tiers are available for most tools (Google Analytics, Mixpanel, Amplitude, PostHog). Paid plans typically start around $25-100/month for small teams and can scale to thousands for enterprise. Pricing is often based on event volume, number of users tracked, or data retention periods.`
  },
  {
    question: "What metrics should I track first?",
    answer: `Start with fundamental metrics: user acquisition, activation (first meaningful action), retention rates, and feature adoption. Track user journeys through your key workflows and identify drop-off points. Focus on metrics that directly relate to your business goals rather than vanity metrics. Our guides provide detailed frameworks for choosing the right metrics.`
  },
  {
    question: "Can I use multiple analytics tools together?",
    answer: `Yes, many companies use multiple tools for different purposes. For example, you might use Google Analytics for web traffic, Mixpanel for product events, and Hotjar for user experience insights. However, be mindful of data consistency, implementation complexity, and costs. Start with one primary tool and add others as specific needs arise.`
  },
  {
    question: "How do I ensure data privacy compliance?",
    answer: `Most modern analytics tools offer GDPR, CCPA, and other privacy compliance features. Key steps include: implementing proper consent management, anonymizing user data, providing data deletion capabilities, and being transparent about data collection. Review each tool's privacy features and compliance certifications before implementation.`
  }
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about {siteConfig.categoryName.toLowerCase()} and how to choose the right solution for your needs.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Have a question not covered here?
          </p>
          <p className="text-sm text-muted-foreground">
            Our guides section provides detailed information about implementing and optimizing {siteConfig.categoryName.toLowerCase()}.
          </p>
        </div>
      </div>
    </section>
  );
} 