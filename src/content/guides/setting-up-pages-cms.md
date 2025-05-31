---
id: setting-up-pages-cms
slug: setting-up-pages-cms
title: How to Use Pages CMS for Content Management
excerpt: Learn how to create and manage guides using Pages CMS - a powerful, user-friendly content management system for your analytics tools directory.
category: tutorials
publishedDate: '2024-03-20'
author: Analytics Team
readingTime: 7 min read
imageUrl: /images/guides/pages-cms-hero.jpg
relatedItems:
  - notion
  - contentful
---

# How to Use Pages CMS for Content Management

Pages CMS has been integrated into our analytics tools directory to make content creation and management easier than ever. This guide will walk you through everything you need to know to create and manage guides effectively.

## What is Pages CMS?

Pages CMS is a Git-based content management system that allows you to edit content through a user-friendly interface while keeping everything in your repository. It's perfect for teams who want the benefits of a CMS without the complexity of a headless setup.

## Key Benefits

### 1. **Easy Content Creation**
- No need to write markdown manually
- Visual editor with live preview
- Form-based field editing

### 2. **Git-Based Workflow**
- All changes are committed to your repository
- Full version history and rollback capability
- Works with your existing CI/CD pipeline

### 3. **Team Collaboration**
- Multiple editors can work simultaneously
- Review and approval workflows
- Role-based access control

## Getting Started with Pages CMS

### Step 1: Access the CMS

1. Navigate to [https://pagescms.org](https://pagescms.org)
2. Connect your GitHub account
3. Select your repository and branch
4. Pages CMS will automatically detect the configuration

### Step 2: Understanding the Interface

The Pages CMS interface includes:

- **Sidebar Navigation**: Browse different content types
- **Content List**: View all guides in the collection
- **Editor**: Create and edit content
- **Preview**: See how your content will look
- **Media Library**: Manage images and assets

### Step 3: Creating Your First Guide

1. **Click "New Guide"** in the Guides section
2. **Fill in the Required Fields**:
   - **ID**: Unique identifier (e.g., `my-first-guide`)
   - **Slug**: URL-friendly version
   - **Title**: Your guide title
   - **Excerpt**: Brief description for SEO
3. **Add Optional Fields**:
   - **Category**: Choose from predefined options
   - **Author**: Your name or team name
   - **Reading Time**: Estimated time to read
   - **Featured Image**: Upload a hero image
4. **Write Your Content** using the markdown editor
5. **Preview** your guide to see how it looks
6. **Save** to publish your guide

## Best Practices for Content Creation

### Writing Effective Guides

**Structure Your Content**
- Start with a clear introduction
- Use descriptive headings and subheadings
- Include actionable steps and examples
- End with a conclusion or next steps

**Optimize for SEO**
- Include relevant keywords naturally
- Write compelling excerpts
- Use descriptive image alt text
- Choose appropriate categories

**Enhance with Media**
- Add screenshots for tutorials
- Use diagrams to explain concepts
- Include hero images for visual appeal
- Optimize images for web performance

### Content Guidelines

**Tone and Voice**
- Keep it professional but approachable
- Use clear, concise language
- Avoid jargon when possible
- Include practical examples

**Formatting Standards**
- Use consistent heading levels
- Add code blocks for technical content
- Include bullet points for lists
- Use bold text for emphasis

## Managing Your Content

### Editing Existing Guides

1. **Browse Guides**: Find the guide you want to edit
2. **Click to Edit**: Open the guide in the editor
3. **Make Changes**: Update any field or content
4. **Preview Changes**: Check how they look
5. **Save Updates**: Publish your changes

### Organizing with Categories

Our guide categories include:
- **Analytics**: Core analytics concepts
- **Getting Started**: Beginner-friendly guides
- **Advanced**: In-depth technical guides
- **Tools**: Tool-specific tutorials
- **Best Practices**: Industry standards and tips
- **Tutorials**: Step-by-step instructions

### Adding Related Items

Link your guides to relevant tools in the directory:
1. Use the **Related Items** field
2. Add tool slugs (e.g., `google-analytics`, `mixpanel`)
3. These will appear as cards at the bottom of your guide
4. Helps users discover relevant tools

## Technical Details

### File Structure

Pages CMS saves your guides as markdown files:
```
src/content/guides/
├── getting-started-with-analytics.md
├── setting-up-pages-cms.md
└── your-new-guide.md
```

### Frontmatter Format

Each guide includes structured metadata:
```yaml
---
id: unique-guide-id
slug: url-friendly-slug
title: Your Guide Title
excerpt: Brief description
category: tutorials
publishedDate: '2024-03-20'
author: Analytics Team
readingTime: 7 min read
imageUrl: /images/guides/hero.jpg
relatedItems:
  - tool-slug-1
  - tool-slug-2
---
```

### Image Management

- Images are stored in `public/images/guides/`
- Use the image upload field in Pages CMS
- Recommended size: 1200x630px for hero images
- Always include descriptive alt text

## Troubleshooting

### Common Issues

**Can't see my changes?**
- Check that you saved your changes
- Verify the build process completed
- Clear your browser cache

**Images not displaying?**
- Ensure images are uploaded to the correct folder
- Check that file paths start with `/images/guides/`
- Verify image file names don't contain spaces

**Related items not showing?**
- Confirm tool slugs exist in your directory
- Check spelling and case sensitivity
- Ensure tools are published and active

## Next Steps

Now that you know how to use Pages CMS, you can:

1. **Create Your First Guide**: Start with a topic you know well
2. **Explore Advanced Features**: Try different field types and options
3. **Collaborate with Your Team**: Invite others to contribute content
4. **Monitor Performance**: Track how your guides perform with analytics

## Conclusion

Pages CMS makes content management simple and powerful. With this setup, you can focus on creating great content while the technical details are handled automatically. The combination of ease-of-use and Git-based workflow gives you the best of both worlds.

Ready to start creating? Head over to Pages CMS and begin building your content library! 