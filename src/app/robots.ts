
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Replace with your actual domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Add disallow rules if any specific paths should not be crawled
      // disallow: '/private/', 
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
