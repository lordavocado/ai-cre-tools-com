# Pages CMS Integration Guide

## Overview

Pages CMS has been successfully integrated into your project to manage the **Guides section**. This allows for easy content creation and editing through a user-friendly interface while maintaining your existing Next.js build process.

## What's Configured

### ✅ Content Management
- **Collection**: Guides (`src/content/guides/`)
- **Format**: Markdown with frontmatter
- **Media**: Images stored in `public/images/guides/`

### ✅ Field Configuration
- **ID**: Unique identifier
- **Slug**: URL-friendly version
- **Title**: Guide title
- **Excerpt**: SEO-friendly description
- **Category**: Organized categories (Analytics, Getting Started, etc.)
- **Published Date**: Publication date
- **Author**: Author name (defaults to "Analytics Team")
- **Reading Time**: Estimated reading time
- **Featured Image**: Optional hero image
- **Related Items**: Links to tools/items in your directory
- **Content**: Main markdown content

### ✅ Media Management
- **Input folder**: `public/images/`
- **Guide images**: `public/images/guides/`
- **Web path**: `/images/guides/`

## How to Use Pages CMS

### 1. Accessing Pages CMS

1. Go to [https://pagescms.org](https://pagescms.org)
2. Connect your GitHub repository
3. Select the branch containing your `.pages.yml` file
4. Pages CMS will automatically detect your configuration

### 2. Creating a New Guide

1. **Navigate to Guides**: Click on "Guides" in the sidebar
2. **Create New**: Click "New Guide" button
3. **Fill in Fields**:
   - **ID**: Use a unique identifier (e.g., `advanced-analytics-setup`)
   - **URL Slug**: Match the ID or use SEO-friendly version
   - **Title**: Your guide title
   - **Excerpt**: 150-200 character description
   - **Category**: Choose from predefined options
   - **Published Date**: Select publication date
   - **Author**: Author name (optional)
   - **Reading Time**: e.g., "8 min read"
   - **Featured Image**: Upload image (recommended: 1200x630px)
   - **Related Items**: Add tool slugs if applicable
   - **Content**: Write your guide in Markdown

4. **Preview**: Use the preview function to see how it looks
5. **Save**: Click save to create the file

### 3. Editing Existing Guides

1. **Browse Guides**: View all guides in the collection
2. **Select Guide**: Click on the guide you want to edit
3. **Edit Fields**: Update any field as needed
4. **Update Content**: Modify the markdown content
5. **Save Changes**: Click save to update

### 4. Managing Images

1. **Upload Images**: Use the image field to upload new images
2. **Image Path**: Images are automatically stored in `/images/guides/`
3. **Optimization**: Consider optimizing images before upload
4. **Alt Text**: Always provide descriptive alt text

## Content Guidelines

### Writing Guidelines
- **Title**: Clear, descriptive, and SEO-friendly
- **Excerpt**: Should summarize the guide and include keywords
- **Content**: Use proper Markdown formatting
- **Images**: Use descriptive alt text and appropriate sizing

### SEO Best Practices
- **Slugs**: Use lowercase, hyphens for spaces, no special characters
- **Categories**: Use existing categories for consistency
- **Keywords**: Include relevant keywords naturally in content
- **Meta Description**: Make excerpts engaging and informative

### Markdown Tips
```markdown
# H1 - Main Title (automatically added from title field)
## H2 - Section Headers
### H3 - Subsections

**Bold text**
*Italic text*

- Bullet points
- Another point

1. Numbered lists
2. Second item

[Link text](https://example.com)

![Image alt text](/images/guides/your-image.jpg)
```

## Integration Details

### File Structure
```
src/content/guides/
├── getting-started-with-analytics.md
├── your-new-guide.md
└── ...

public/images/guides/
├── hero-image-1.jpg
├── diagram-2.png
└── ...
```

### Frontmatter Format
```yaml
---
id: unique-guide-id
slug: url-friendly-slug
title: Your Guide Title
excerpt: Brief description for SEO and previews
category: analytics
publishedDate: '2024-03-15'
author: Analytics Team
readingTime: 5 min read
imageUrl: /images/guides/your-image.jpg
relatedItems:
  - tool-slug-1
  - tool-slug-2
---

Your markdown content here...
```

## Technical Notes

### Backward Compatibility
- ✅ Existing guides continue to work
- ✅ Both old and new relatedItems formats supported
- ✅ All existing fields preserved

### Build Process
- ✅ No changes to Next.js build
- ✅ Static generation still works
- ✅ SEO metadata automatically generated

### Search & Filtering
- ✅ Guide search includes all text fields
- ✅ Category filtering works automatically
- ✅ Related items display correctly

## Troubleshooting

### Common Issues

**Issue**: Pages CMS not detecting configuration
- **Solution**: Ensure `.pages.yml` is in repository root
- **Check**: File syntax is valid YAML

**Issue**: Images not displaying
- **Solution**: Check image path starts with `/images/guides/`
- **Verify**: Image exists in `public/images/guides/`

**Issue**: Related items not showing
- **Solution**: Verify tool slugs exist in your directory
- **Check**: Slugs match exactly (case-sensitive)

**Issue**: Build errors after editing
- **Solution**: Check markdown syntax and frontmatter format
- **Verify**: All required fields are present

### Getting Help

1. **Pages CMS Documentation**: [https://pagescms.org/docs](https://pagescms.org/docs)
2. **GitHub Issues**: Check your repository issues
3. **Development Team**: Contact for custom field requirements

## Next Steps

### Recommended Actions
1. **Test the Integration**: Create a test guide through Pages CMS
2. **Train Your Team**: Share this guide with content creators
3. **Backup Strategy**: Ensure your repository has proper backups
4. **Monitor Performance**: Check that build times remain acceptable

### Future Enhancements
- **Custom Fields**: Add more fields as needed
- **Workflow**: Set up content approval workflows
- **Analytics**: Track guide performance
- **Categories**: Add more guide categories as content grows

---

**Questions?** Feel free to reach out if you need help with the Pages CMS integration or want to customize the setup further. 