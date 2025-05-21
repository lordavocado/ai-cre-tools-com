
import type { DirectoryItem, Category, Guide } from '@/types';
import { Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap } from 'lucide-react';

// Mock Data
const mockItems: DirectoryItem[] = [
  {
    id: '1',
    slug: 'awesome-tool-1',
    name: 'Awesome Tool 1',
    tagline: 'The best tool for productivity.',
    description: 'A short description of Awesome Tool 1, revolutionizing how you work.',
    longDescription: '<p>This is a longer, more detailed description of Awesome Tool 1. It supports <strong>HTML</strong> formatting.</p><p>Key benefits include:</p><ul><li>Increased efficiency</li><li>Seamless integration</li><li>User-friendly interface</li></ul>',
    category: 'productivity',
    website: 'https://example.com/tool1',
    imageUrl: 'https://placehold.co/600x400.png',
    features: [{name: 'AI Analysis'}, {name: 'Team Collaboration'}, {name: 'Reporting Dashboard'}],
    pricing: 'Freemium, Pro plan at $20/month',
    rating: 4.5,
    reviewCount: 150,
    pros: ['Easy to use', 'Great support', 'Feature-rich'],
    cons: ['Can be slow at times', 'Mobile app needs improvement'],
    lastUpdated: '2024-05-15T10:00:00Z',
    foundedYear: 2020,
    socials: { twitter: 'tool1', linkedin: 'company/tool1'}
  },
  {
    id: '2',
    slug: 'creative-suite-x',
    name: 'Creative Suite X',
    tagline: 'Unleash your creative potential.',
    description: 'A comprehensive suite for designers and artists.',
    longDescription: '<p>Creative Suite X offers a wide array of tools for graphic design, video editing, and web development. Empower your creativity with our intuitive and powerful platform.</p>',
    category: 'design',
    website: 'https://example.com/creativesuitex',
    imageUrl: 'https://placehold.co/600x400.png',
    features: [{name: 'Vector Editing'}, {name: 'Video Timeline'}, {name: '3D Rendering'}],
    pricing: 'Subscription based, $50/month',
    rating: 4.8,
    reviewCount: 320,
    pros: ['Industry standard', 'Powerful features', 'Regular updates'],
    cons: ['Expensive', 'Steep learning curve'],
    lastUpdated: '2024-05-20T14:30:00Z',
    foundedYear: 2015,
  },
  {
    id: '3',
    slug: 'devops-master',
    name: 'DevOps Master',
    tagline: 'Streamline your development pipeline.',
    description: 'An all-in-one platform for CI/CD and infrastructure management.',
    category: 'developer-tools',
    website: 'https://example.com/devopsmaster',
    imageUrl: 'https://placehold.co/600x400.png',
    features: [{name: 'Automated Builds'}, {name: 'Kubernetes Integration'}, {name: 'Monitoring'}],
    pricing: 'Starts at $100/month',
    rating: 4.2,
    reviewCount: 90,
    pros: ['Scalable', 'Reliable', 'Good integrations'],
    cons: ['Complex setup', 'UI could be better'],
    lastUpdated: '2024-05-01T09:00:00Z',
    foundedYear: 2018,
  },
  {
    id: '4',
    slug: 'finance-guru',
    name: 'Finance Guru',
    tagline: 'Your personal finance expert.',
    description: 'Track expenses, manage budgets, and plan investments with ease.',
    category: 'finance',
    website: 'https://example.com/financeguru',
    imageUrl: 'https://placehold.co/600x400.png',
    features: [{name: 'Budget Tracking'}, {name: 'Investment Portfolio'}, {name: 'Bill Reminders'}],
    pricing: 'Free basic, Premium $10/month',
    rating: 4.6,
    reviewCount: 250,
    pros: ['User-friendly', 'Secure', 'Comprehensive reports'],
    cons: ['Limited free version features'],
    lastUpdated: '2024-05-22T11:00:00Z',
  },
  {
    id: '5',
    slug: 'marketing-pro',
    name: 'Marketing Pro',
    tagline: 'Elevate your marketing strategy.',
    description: 'Tools for SEO, social media, and email campaigns.',
    category: 'marketing',
    website: 'https://example.com/marketingpro',
    imageUrl: 'https://placehold.co/600x400.png',
    features: [{name: 'SEO Analytics'}, {name: 'Social Media Scheduler'}, {name: 'Email Automation'}],
    pricing: '$79/month',
    rating: 4.3,
    reviewCount: 180,
    lastUpdated: '2024-05-18T16:45:00Z',
  },
];

const mockCategories: Category[] = [
  { id: '1', slug: 'productivity', name: 'Productivity', description: 'Tools to boost your efficiency.', longDescription: 'This category includes applications and services designed to help individuals and teams manage their tasks, time, and projects more effectively. From to-do lists to project management platforms, find what you need to get more done.', imageUrl: 'https://placehold.co/400x300.png', itemCount: 1, icon: Zap },
  { id: '2', slug: 'design', name: 'Design Tools', description: 'Software for creative professionals.', longDescription: 'Explore a variety of tools for graphic design, UI/UX, 3D modeling, and more. Whether you are a seasoned professional or just starting, these tools will help bring your visions to life.', imageUrl: 'https://placehold.co/400x300.png', itemCount: 1, icon: Palette },
  { id: '3', slug: 'developer-tools', name: 'Developer Tools', description: 'IDEs, SCM, CI/CD and more for coders.', longDescription: 'This section is dedicated to tools that aid in the software development lifecycle. Find the best IDEs, version control systems, testing frameworks, and deployment utilities.', imageUrl: 'https://placehold.co/400x300.png', itemCount: 1, icon: Settings },
  { id: '4', slug: 'finance', name: 'Finance', description: 'Manage your money effectively.', longDescription: 'Discover tools for personal finance management, business accounting, investment tracking, and cryptocurrency. Take control of your financial future.', imageUrl: 'https://placehold.co/400x300.png', itemCount: 1, icon: BarChart },
  { id: '5', slug: 'marketing', name: 'Marketing', description: 'Reach your audience and grow.', longDescription: 'A collection of tools for digital marketing, including SEO, content creation, social media management, email marketing, and analytics. Amplify your message and engage your customers.', imageUrl: 'https://placehold.co/400x300.png', itemCount: 1, icon: Briefcase },
];

const mockGuides: Guide[] = [
  {
    id: '1',
    slug: 'mastering-productivity-in-2024',
    title: 'Mastering Productivity in 2024',
    excerpt: 'Learn the top strategies and tools to maximize your productivity this year.',
    content: '## Introduction\n\nProductivity is key to success. This guide explores various techniques...\n\n### Tools Mentioned\n\n- Awesome Tool 1\n\n*This is a sample guide content in Markdown.*',
    imageUrl: 'https://placehold.co/800x400.png',
    category: 'productivity',
    relatedItemSlugs: ['awesome-tool-1'],
    publishedDate: '2024-04-10T00:00:00Z',
    author: 'Jane Doe',
    readingTime: '7 min read',
  },
  {
    id: '2',
    slug: 'the-ultimate-guide-to-choosing-design-software',
    title: 'The Ultimate Guide to Choosing Design Software',
    excerpt: 'A comprehensive look at factors to consider when selecting design tools for your projects.',
    content: '## Choosing Wisely\n\nSelecting the right design software can make all the difference...\n\n*Another sample guide.*',
    imageUrl: 'https://placehold.co/800x400.png',
    category: 'design',
    relatedItemSlugs: ['creative-suite-x'],
    publishedDate: '2024-03-22T00:00:00Z',
    author: 'John Smith',
    readingTime: '10 min read',
  },
  {
    id: '3',
    slug: 'effective-devops-practices',
    title: 'Effective DevOps Practices for Modern Teams',
    excerpt: 'Discover best practices in DevOps to improve collaboration and delivery speed.',
    content: '## DevOps Culture\n\nEmbracing DevOps means more than just tools; it\'s about culture...\n\n*A guide on DevOps.*',
    imageUrl: 'https://placehold.co/800x400.png',
    category: 'developer-tools',
    relatedItemSlugs: ['devops-master'],
    publishedDate: '2024-02-15T00:00:00Z',
    author: 'Alice Brown',
    readingTime: '8 min read',
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDirectoryItems(searchTerm?: string, categoryFilter?: string): Promise<DirectoryItem[]> {
  await delay(300);
  let items = mockItems;
  if (searchTerm) {
    items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  if (categoryFilter) {
    items = items.filter(item => item.category === categoryFilter);
  }
  return items;
}

export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  await delay(200);
  return mockItems.find(item => item.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  await delay(100);
  // Update item counts (simple mock)
  return mockCategories.map(cat => ({
    ...cat,
    itemCount: mockItems.filter(item => item.category === cat.slug).length
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await delay(100);
  const category = mockCategories.find(cat => cat.slug === slug);
  if (category) {
    return {
      ...category,
      itemCount: mockItems.filter(item => item.category === category.slug).length
    };
  }
  return undefined;
}

export async function getGuides(searchTerm?: string): Promise<Guide[]> {
  await delay(300);
  if (searchTerm) {
    return mockGuides.filter(guide => guide.title.toLowerCase().includes(searchTerm.toLowerCase()) || guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  return mockGuides;
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  await delay(200);
  return mockGuides.find(guide => guide.slug === slug);
}

export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  await delay(500);
  console.log(`Newsletter subscription for: ${email}`);
  if (!email.includes('@')) {
    return { success: false, message: 'Invalid email address.' };
  }
  // Simulate success/failure
  if (email === 'fail@example.com') {
     return { success: false, message: 'Subscription failed. Please try again.' };
  }
  return { success: true, message: 'Successfully subscribed to the newsletter!' };
}

export async function getItemsForComparison(ids: string[]): Promise<DirectoryItem[]> {
  await delay(300);
  return mockItems.filter(item => ids.includes(item.id));
}

// This is a mock for the AI feature. In a real app, this would call a Genkit flow.
export async function getAISuggestedDifferences(items: DirectoryItem[]): Promise<string[]> {
  await delay(1000);
  if (items.length < 2) return ["Please select at least two items to compare."];

  const suggestions = [
    `${items[0].name} excels in ${items[0].pros?.[0] || 'key areas'}, while ${items[1].name} offers strong ${items[1].features?.[0]?.name || 'alternative features'}.`,
    `Consider ${items[0].name}'s pricing (${items[0].pricing}) versus ${items[1].name}'s (${items[1].pricing}) for your budget.`,
  ];
  if (items.length > 2 && items[2]) {
    suggestions.push(`${items[2].name} provides a unique approach with its ${items[2].tagline.toLowerCase()}.`);
  }
  return suggestions;
}

export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  await delay(100);
  return mockItems.slice(0, limit);
}

export async function getRecentGuides(limit: number = 3): Promise<Guide[]> {
  await delay(100);
  return mockGuides.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()).slice(0, limit);
}

export async function getTopCategories(limit: number = 4): Promise<Category[]> {
  await delay(100);
   return mockCategories.sort((a,b) => (b.itemCount || 0) - (a.itemCount || 0)).slice(0, limit).map(cat => ({
    ...cat,
    itemCount: mockItems.filter(item => item.category === cat.slug).length
  }));
}

