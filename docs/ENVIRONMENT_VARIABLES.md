# Environment Variables Configuration

This document outlines the environment variables required for the AI CRE Tools website.

## Required Variables

### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://aicretools.com
```
- **Purpose**: Defines the canonical site URL for SEO and social sharing
- **Required**: Yes
- **Default**: None

### Admin Configuration
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password_in_production
```
- **Purpose**: Basic authentication for admin routes
- **Required**: Yes (for admin functionality)
- **Security**: Change the password in production!

## Optional Variables

### Google Sheets Integration
```bash
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_DOC_ID=your-google-sheets-document-id
```
- **Purpose**: Enables Google Sheets integration for tool data
- **Required**: No (will fallback to empty data)

### Perplexity AI API
```bash
PERPLEXITY_API_KEY=your-perplexity-api-key
```
- **Purpose**: Enables automated tool research and data enrichment
- **Required**: No

### PostHog Analytics
```bash
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-project-key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```
- **Purpose**: Enables analytics and user tracking
- **Required**: No

### Mailchimp Integration
```bash
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your-audience-id
```
- **Purpose**: Enables newsletter subscription functionality
- **Required**: No

### Tool Submission Notifications (Optional)
```bash
RESEND_API_KEY=re_your_resend_api_key
SUBMISSION_NOTIFY_EMAIL=you@example.com
RESEND_FROM_EMAIL=AI CRE Tools <notifications@aicretools.com>
```
- **Purpose**: Sends you an email when someone submits a new tool via `/submit-tool`
- **Required**: No (submissions still work without it)
- **RESEND_API_KEY**: API key from [Resend](https://resend.com)
- **SUBMISSION_NOTIFY_EMAIL**: Your inbox; comma-separate multiple addresses if needed
- **RESEND_FROM_EMAIL**: Optional sender address. Must use a domain verified in Resend (or `onboarding@resend.dev` while testing)

## Setup Instructions

1. Copy the required variables to your `.env.local` file
2. Replace placeholder values with your actual credentials
3. Never commit `.env.local` to version control
4. Use strong passwords for admin access in production

## Security Notes

- Admin passwords should be at least 12 characters long
- Use environment-specific values (development vs production)
- Rotate API keys regularly
- Store sensitive keys securely (not in plain text)

## Testing

After setting up environment variables, test that:
- Site loads correctly with proper URLs
- Admin routes are protected
- Analytics tracking works (if enabled)
- Newsletter signup functions (if enabled)
