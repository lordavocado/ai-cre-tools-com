# Environment Setup Guide

This guide helps you set up the required environment variables to resolve console errors and properly configure the application.

## Quick Setup

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Fill in your actual values in `.env.local`

## Required Environment Variables

### PostHog Analytics (Required)
To fix the "PostHog was initialized without a token" error:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

**How to get these values:**
1. Sign up at [PostHog](https://posthog.com)
2. Create a new project
3. Go to Project Settings → API Keys
4. Copy your Project API Key as `NEXT_PUBLIC_POSTHOG_KEY`
5. Use `https://eu.i.posthog.com` for EU region or `https://app.posthog.com` for US

### Admin Access
For accessing admin features:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### Google Sheets Integration (Optional)
For dynamic content management:

```env
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"
```

### Mailchimp Integration (Optional)
For newsletter functionality:

```env
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_LIST_ID=your_list_id
```

## Development vs Production

### Development
```env
NODE_ENV=development
```
This enables debug mode for PostHog and other development features.

### Production
```env
NODE_ENV=production
```

## Common Issues & Solutions

### 1. PostHog Initialization Error
**Error:** `PostHog was initialized without a token`

**Solution:** Ensure `NEXT_PUBLIC_POSTHOG_KEY` is set in your `.env.local` file

### 2. SVG Path Errors
**Error:** `Error: <path> attribute d: Expected number`

**Solution:** This has been fixed in the codebase. Make sure you're using the latest version.

### 3. Missing site.webmanifest
**Error:** `GET https://your-domain.com/site.webmanifest 404 (Not Found)`

**Solution:** The `site.webmanifest` file has been created and should resolve this issue.

## Environment File Template

Create a `.env.local` file with this template:

```env
# Required for admin access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# PostHog Analytics (REQUIRED to fix console errors)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

# Google Sheets integration (optional)
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# Mailchimp integration (optional)
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=

# Development mode
NODE_ENV=development
```

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for admin access
- Keep API keys secure and rotate them regularly
- For production, consider using a secure secret management service

## Verification

After setting up your environment variables:

1. Restart your development server: `npm run dev`
2. Check the browser console - PostHog errors should be resolved
3. Verify the web manifest loads: visit `/site.webmanifest`
4. Test admin access if configured

## Need Help?

If you're still experiencing issues:

1. Check that all required environment variables are set
2. Verify there are no typos in variable names
3. Ensure the PostHog key starts with `phc_`
4. Check the browser network tab for failed requests 