# Site Configuration Guide

## Overview

This project now includes a centralized configuration system that allows you to update key site information from a single location. The main configuration file is located at `src/config/site.ts`.

## Changing the Category Name

To change your site's main category name (currently "AI CRE Tools"), simply update the `categoryName` field in `src/config/site.ts`:

```typescript
export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "Your New Category Name", // ← Change this line
  
  // ... rest of config
}
```

### What Gets Updated Automatically

When you change the `categoryName`, the following elements will be updated automatically across your entire site:

1. **Header/Navigation**: The site logo text in both desktop and mobile views
2. **Footer**: The logo text and description
3. **Hero Section**: The main headline "Find and compare the best {categoryName}"
4. **Page Titles**: Browser tab titles and SEO metadata
5. **Copyright Text**: Footer copyright notice
6. **OpenGraph/Social Media**: When shared on social platforms
7. **Homepage Sections**: 
   - "Discover Top {categoryName}"
   - "Browse {categoryName} by Category"
8. **Search Results**: Tool count displays (e.g., "15 AI CRE tools found")
9. **Categories Page**: Title and descriptions

### Example Changes

If you change `categoryName` from "Product Analytics Tools" to "AI CRE Tools", these updates happen automatically:

- Header: "Product Analytics Tools" → "AI CRE Tools"
- Hero: "Find and compare the best Product Analytics Tools" → "Your Directory for the Best AI CRE Tools"
- Page Title: "Product Analytics Tools Directory" → "AI CRE Tools Directory"
- Footer: "© 2024 Product Analytics Tools" → "© 2024 AI CRE Tools"
- Homepage: "Discover Top Product Analytics Tools" → "Discover Top AI CRE Tools"
- Categories: "Browse Product Analytics Tools by Category" → "Browse AI CRE Tools by Category"
- Search: "15 product analytics tools found" → "15 AI CRE tools found"

## Other Configurable Settings

### Site Metadata
```typescript
name: "Sheet2Site Pro",           // Your site/company name
description: "...",               // SEO description
url: "https://yourdomain.com",    // Your actual domain
```

### Hero Section
```typescript
hero: {
  title: "Find and compare the best {categoryName}",    // {categoryName} gets replaced automatically
  subtitle: "Your custom subtitle here...",
},
```

### Navigation
```typescript
nav: {
  items: [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Browse Tools' }, // Customize labels
  ]
},
```

### SEO Keywords
```typescript
keywords: [
  'directory builder', 
  'google sheets', 
  'your custom keywords',
  // Add relevant keywords for your niche
],
```

### Social Links
```typescript
social: {
  twitter: "@yourtwitterhandle",
  linkedin: "company/yourcompany",
  github: "yourgithub",
},
```

## How It Works

The configuration system uses:

1. **Static Configuration**: Direct values that don't change
2. **Template Interpolation**: Text with `{categoryName}` placeholders that get replaced
3. **Computed Values**: Pre-processed configurations with placeholders resolved

The `interpolateText()` function automatically replaces `{categoryName}` placeholders with your actual category name throughout the site.

## Making Changes

1. Open `src/config/site.ts`
2. Update the `categoryName` field with your desired category name
3. Optionally update other fields like `description`, `url`, `keywords`, etc.
4. Save the file
5. Your changes will be reflected across the entire site automatically

## Benefits

- **Single Source of Truth**: Change the category name once, update everywhere
- **Consistency**: Ensures all references use the same text
- **SEO Friendly**: Automatically updates metadata and page titles
- **Maintainable**: Easy to update branding across the entire site
- **Type Safe**: TypeScript ensures configuration is used correctly

## Need Help?

If you need to add new configurable elements or have questions about the configuration system, refer to the existing patterns in `src/config/site.ts` and how they're used in the components. 