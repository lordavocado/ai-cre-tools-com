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

### OpenAI Responses API
```bash
OPENAI_API_KEY=sk-your-server-only-api-key
OPENAI_TOOL_SUBMISSION_MODEL=gpt-5.6-terra
OPENAI_TOOL_SUBMISSION_REASONING_EFFORT=medium
OPENAI_TOOL_SUBMISSION_MIN_CONFIDENCE=0.82
```
- **Purpose**: Runs relevance review, built-in web research, structured directory copy generation, and evidence collection in one Responses API call
- **Required**: Yes for the public `/submit-tool` automation
- **Model**: `gpt-5.6-terra` is the default. Terra preserves Responses API web search, reasoning, and structured outputs while balancing evaluation quality and cost. Override it only after testing the replacement on representative submissions
- **Reasoning**: `medium` is the balanced default; supported configured values are `none`, `low`, `medium`, `high`, `xhigh`, and `max`
- **Confidence gate**: Decisions below `0.82` or without verified web evidence remain pending. Acceptances additionally require verified evidence from the submitted product; high-confidence rejections may rely on verified independent evidence
- **Security**: `OPENAI_API_KEY` is server-only and must never use a `NEXT_PUBLIC_` prefix

### Automated Tool Publishing
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_your_key
SUPABASE_SECRET_KEY=sb_secret_your_server_key
# Legacy fallback: SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```
- **Purpose**: Stores each submission and writes accepted tools to `ecosystem_apps`
- **Required**: Yes for `/submit-tool`
- **Security**: `SUPABASE_SECRET_KEY` and the legacy `SUPABASE_SERVICE_ROLE_KEY` are server-only and must never use a `NEXT_PUBLIC_` prefix

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
- **Purpose**: Emails the directory owner after the AI accepts, rejects, or defers a tool, including its confidence, evidence, rationale, and every field written for accepted listings
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
