
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Google Sheets as a Database

This project is configured to use Google Sheets as a database for its content (directory items, categories, guides).

### 1. Environment Variables Setup

Before running the application, you need to set up your Google Cloud Service Account and Google Sheet credentials.

1.  **Enable Google Sheets API**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and ensure the Google Sheets API is enabled for your project.
2.  **Create a Service Account**:
    *   In the Google Cloud Console, navigate to "IAM & Admin" > "Service Accounts".
    *   Click "Create Service Account".
    *   Give it a name (e.g., "sheet2site-reader") and a description.
    *   Grant it the "Viewer" role for basic read access to your project resources. For writing (like newsletter subscriptions), it might need more specific roles or you might handle that differently. For reading sheets, "Viewer" on the project, and then sharing the sheet with the service account email is typical.
    *   Click "Done".
3.  **Create Service Account Key**:
    *   Find your newly created service account in the list.
    *   Click the three dots (Actions) next to it and select "Manage keys".
    *   Click "Add Key" > "Create new key".
    *   Choose "JSON" as the key type and click "Create". A JSON file will be downloaded.
4.  **Share your Google Sheet**:
    *   Open the Google Sheet you want to use as your database.
    *   Click the "Share" button (top right).
    *   Enter the service account's email address (e.g., `your-service-account-name@your-project-id.iam.gserviceaccount.com` – found in the downloaded JSON key file under `client_email` or in the service account details in Cloud Console).
    *   Give it at least "Viewer" permission if the app only reads data. If you use the newsletter subscription feature, it will need "Editor" permission for the sheet it writes to.
5.  **Set up `.env.local`**:
    *   In the root directory of your project, create a file named `.env.local` (if it doesn't already exist).
    *   Add the following environment variables, replacing the placeholder values with your actual credentials from the downloaded JSON key file and your sheet ID:

        ```env
        # .env.local

        # === Google Sheets Configuration ===
        # Get this from your Google Sheet URL:
        # e.g., if URL is https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
        GOOGLE_SHEET_ID="YOUR_SHEET_ID"

        # From the downloaded service account JSON key file:
        GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@your-project-id.iam.gserviceaccount.com"

        # From the downloaded service account JSON key file (private_key field).
        # IMPORTANT: Replace all literal newline characters (\n) in the original private key
        # with the two characters '\\n' (a backslash followed by an 'n').
        # The entire key should be enclosed in double quotes.
        GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINE_1\nYOUR_KEY_LINE_2\n...\n-----END PRIVATE KEY-----\n"

        # === Mailchimp Configuration (for Newsletter) ===
        # Get this from your Mailchimp account - see Mailchimp setup section below
        MAILCHIMP_API_KEY="your-api-key-datacenter"
        MAILCHIMP_LIST_ID="your-list-id"
        ```

    *   **CRITICAL**: The `GOOGLE_PRIVATE_KEY` must have its original newline characters escaped as `\n` (a literal backslash followed by an 'n').
    *   **Do not commit `.env.local` to version control.** Add it to your `.gitignore` file.

6.  **Restart Next.js Server**: After creating or modifying `.env.local`, you **must** restart your Next.js development server for the changes to take effect (`npm run dev`, `yarn dev`, or `pnpm dev`).

### 1.5. Mailchimp Newsletter Integration Setup

This project includes a secure Mailchimp integration for email newsletter subscriptions. Follow these steps to configure Mailchimp:

#### Prerequisites
- A Mailchimp account (free account works fine)
- An audience/list created in Mailchimp

#### Step-by-Step Setup

1. **Create or Access Your Mailchimp Audience**:
   - Log in to your [Mailchimp account](https://mailchimp.com/)
   - Go to "Audience" → "All contacts" or create a new audience if you don't have one
   - Note: An audience is what Mailchimp calls an email list

2. **Get Your List ID**:
   - In your Mailchimp dashboard, go to "Audience" → "Manage Audience" → "Settings"
   - Look for "Audience ID" or "List ID" 
   - Copy this ID (it's typically a 10-character alphanumeric string like `a1b2c3d4e5`)

3. **Generate API Key**:
   - In Mailchimp, click on your profile icon (top right) → "Account"
   - Go to "Extras" → "API keys"
   - Click "Create A Key"
   - Give it a descriptive name like "Website Newsletter Integration"
   - Copy the generated API key (format: `key-datacenter`, e.g., `abc123def456ghi789-us1`)
   
4. **Add to Environment Variables**:
   - Add these to your `.env.local` file:
   ```env
   MAILCHIMP_API_KEY="your-api-key-datacenter"
   MAILCHIMP_LIST_ID="your-list-id"
   ```

5. **Configure Audience Settings (Recommended)**:
   - In Mailchimp, go to "Audience" → "Manage Audience" → "Settings"
   - **Enable Double Opt-in** (recommended for better deliverability):
     - Go to "Audience" → "Manage Audience" → "Settings" → "Audience defaults"
     - Check "Enable double opt-in"
   - **Customize Welcome Email** (optional):
     - Go to "Audience" → "Manage Audience" → "Settings" → "Form settings"
     - Customize the confirmation and welcome emails

6. **Test the Integration**:
   - Restart your development server: `npm run dev`
   - **Quick Test**: Run `node scripts/test-mailchimp.js` to validate your configuration
   - Visit your website and try subscribing to the newsletter
   - Check your Mailchimp audience to see if the email was added
   - If double opt-in is enabled, check the subscriber's email for the confirmation message

#### Security Features
- ✅ Server-side only processing (API keys never exposed to client)
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling for all Mailchimp API responses
- ✅ Handles duplicate subscriptions gracefully
- ✅ Automatic resubscription for previously unsubscribed users
- ✅ Rate limiting through Mailchimp's built-in protections

#### Troubleshooting
- **"Service temporarily unavailable"**: Check your API key and list ID
- **"Invalid email address"**: The API validates email format server-side
- **"Already subscribed"**: User will see a friendly message, no error thrown
- **Network errors**: Automatic retry logic with user-friendly messaging

#### What You Need from Mailchimp Interface:
1. **API Key**: Account → Extras → API keys → Create A Key
2. **List ID**: Audience → Manage Audience → Settings → Audience ID
3. **Audience setup**: Create an audience if you don't have one
4. **Optional settings**: Double opt-in, welcome emails, custom fields

#### Advanced Features: Tags and Segmentation

The integration supports powerful subscriber segmentation through:

**🏷️ Tags**: Automatically tag subscribers based on signup source
- Each signup form can assign custom tags
- Perfect for tracking signup sources and user intent
- Examples: "Homepage Signup", "Blog Reader", "High Intent"

**🎯 Interest Groups**: Let users choose their content preferences
- Mailchimp interests for targeted content delivery
- Supports multiple interest categories
- Users can select what content they want to receive

**📊 Merge Fields**: Collect additional subscriber data
- Name collection (FNAME, LNAME)
- Source tracking (automatically added)
- Custom fields for any additional data

**Pre-configured Sources**:
- `homepage`: Homepage newsletter signup
- `blog`: Blog/article signups  
- `product`: Product page signups (high intent)
- `footer`: Footer newsletter forms
- `popup`: Modal/popup signups
- `exit-intent`: Exit intent popups

**Usage Examples**:
```tsx
// Simple form with automatic tagging
<NewsletterForm source="blog" />

// Advanced form with interests and custom tags
<AdvancedNewsletterForm 
  source="premium"
  availableTags={["VIP", "Early Access"]}
  availableInterests={[
    { id: "updates", name: "Product Updates" },
    { id: "offers", name: "Special Offers" }
  ]}
/>
```

**Admin Features**:
- Visit `/admin/newsletter` for subscriber statistics and tag overview
- Visit `/newsletter-examples` to see all form types in action
- View active tags and interest groups
- Track subscriber counts per segment

**Optional Functions**:
- `checkSubscriptionStatus(email)`: Check if an email is already subscribed
- `getListStats()`: Get subscriber statistics
- `getListTags()`: Retrieve all active tags
- `getListInterests()`: Get interest categories and groups

For more advanced customization, edit `src/lib/mailchimp.ts`.

### 2. Customizing Google Sheet Database Structure

The `src/lib/sheets.ts` file is responsible for fetching and parsing data from your Google Sheet. To adapt this to your specific sheet structure, you'll primarily need to modify configurations within this file.

#### a. Sheet Names

The application expects specific names for the sheets (tabs) within your Google Spreadsheet. You can configure these names at the top of `src/lib/sheets.ts` in the `SHEET_NAMES` object:

```typescript
// src/lib/sheets.ts
const SHEET_NAMES = {
  ITEMS: 'Items',         // Sheet for your directory items/tools
  CATEGORIES: 'Categories', // Sheet for your categories
  GUIDES: 'Guides',         // Sheet for your guides/blog posts
  NEWSLETTER: 'Newsletter', // Sheet for newsletter subscriptions
};
```
Change the string values (e.g., `'Items'`) to match the actual names of your sheets.

#### b. Column Mappings

For each sheet, the application expects certain columns to exist. The mapping between the expected data fields (like `id`, `name`, `slug`) and the actual column headers in your Google Sheet is defined in the `COLUMN_MAPPINGS` object in `src/lib/sheets.ts`.

You need to update these mappings if your column names differ.

**Items Sheet Columns (Example Configuration in `COLUMN_MAPPINGS.ITEMS`):**
*   `ID`: Unique identifier for the item (e.g., `ID`)
*   `SLUG`: URL-friendly slug (e.g., `Slug`)
*   `NAME`: Display name (e.g., `Name`)
*   `TAGLINE`: Short catchy phrase (e.g., `Tagline`)
*   `DESCRIPTION`: Brief description for listings (e.g., `Description`)
*   `LONG_DESCRIPTION`: Detailed HTML description for item page (e.g., `Long Description`)
*   `CATEGORY_SLUG`: Category slug (must match a slug in Categories sheet) (e.g., `Category Slug`)
*   `WEBSITE`: Official website URL (e.g., `Website`)
*   `IMAGE_URL`: Main image/logo URL (e.g., `Image URL`)
*   `FEATURES_JSON`: JSON string for features. Example: `[{"name": "AI Analysis", "description": "Detailed insights"}, {"name": "Team Collab"}]` (e.g., `Features JSON`)
*   `PRICING`: Pricing description (e.g., `Pricing`)
*   `RATING`: Numerical rating (e.g., `Rating`)
*   `REVIEW_COUNT`: Number of reviews (e.g., `Review Count`)
*   `PROS`: Comma-separated pros (e.g., `Pros`)
*   `CONS`: Comma-separated cons (e.g., `Cons`)
*   `LAST_UPDATED`: Last update date (e.g., `Last Updated`)
*   `FOUNDED_YEAR`: Founding year (e.g., `Founded Year`)
*   `SOCIALS_JSON`: JSON for social links. Example: `{"twitter": "handle", "linkedin": "company/id"}` (e.g., `Socials JSON`)

**Categories Sheet Columns (Example Configuration in `COLUMN_MAPPINGS.CATEGORIES`):**
*   `ID`: Unique ID (e.g., `ID`)
*   `SLUG`: URL-friendly slug (e.g., `Slug`)
*   `NAME`: Category name (e.g., `Name`)
*   `DESCRIPTION`: Short description (e.g., `Description`)
*   `LONG_DESCRIPTION`: Detailed HTML description for category page (e.g., `Long Description`)
*   `IMAGE_URL`: Category image URL (e.g., `Image URL`)
*   `ICON_NAME`: Lucide icon name (e.g., `Zap`, `Palette`) (e.g., `Icon Name`)

**Guides Sheet Columns (Example Configuration in `COLUMN_MAPPINGS.GUIDES`):**
*   `ID`: Unique ID (e.g., `ID`)
*   `SLUG`: URL-friendly slug (e.g., `Slug`)
*   `TITLE`: Guide title (e.g., `Title`)
*   `EXCERPT`: Short summary (e.g., `Excerpt`)
*   `CONTENT`: Main content in Markdown (e.g., `Content`)
*   `IMAGE_URL`: Guide image URL (e.g., `Image URL`)
*   `CATEGORY_SLUG`: Optional related category slug (e.g., `Category Slug`)
*   `RELATED_ITEM_SLUGS`: Optional comma-separated item slugs (e.g., `Related Item Slugs`)
*   `PUBLISHED_DATE`: Publication date (e.g., `Published Date`)
*   `AUTHOR`: Author's name (e.g., `Author`)
*   `READING_TIME`: Estimated reading time (e.g., `Reading Time`)

**Newsletter Sheet Columns (Example Configuration in `COLUMN_MAPPINGS.NEWSLETTER`):**
*   `EMAIL`: Column for submitted emails (e.g., `Email`)
*   `TIMESTAMP`: Column for submission timestamp (e.g., `Timestamp`)

**How to Update Mappings:**
If your "Items" sheet uses "Product Title" instead of "Name" for the item's name, you would modify `src/lib/sheets.ts` within the `COLUMN_MAPPINGS.ITEMS` object:
From: `NAME: 'Name',`
To: `NAME: 'Product Title',`

Ensure your Google Sheet columns match these configured names, or update the configuration in `src/lib/sheets.ts` to reflect your sheet's structure.

#### c. Data Types and Formatting

-   **JSON Fields** (`Features JSON`, `Socials JSON`): These columns in your sheet must contain valid JSON strings.
-   **Array Fields** (`Pros`, `Cons`, `Related Item Slugs`): These should be comma-separated strings. For example, a "Pros" column might contain: `Easy to use,Great support,Affordable`.
-   **Dates** (`Last Updated`, `Published Date`): While flexible, using a consistent format like `YYYY-MM-DD` or a full ISO date string (e.g., `2024-05-28T10:00:00Z`) is recommended for proper date parsing and sorting.
-   **HTML Content** (`Long Description` for Items and Categories): You can use HTML tags for rich text formatting in these fields.
-   **Markdown Content** (`Content` for Guides): The main content for guides is parsed as Markdown.

By updating these configurations in `src/lib/sheets.ts`, you can adapt the application to work with your specific Google Sheet layout. Remember to restart your development server if you modify `.env.local` or make significant changes to `src/lib/sheets.ts` that might affect module loading.

## Quick Setup Checklist for New Directory

When setting up this project for a new directory/niche, here's your checklist:

### 🔧 Configuration
- [ ] Update `src/config/site.ts` with your directory name and branding
- [ ] Modify `categoryName` field to match your directory focus
- [ ] Update social links, description, and keywords

### 📊 Google Sheets Setup
- [ ] Create Google Cloud Service Account and download JSON key
- [ ] Create your Google Sheet with proper column structure
- [ ] Share sheet with service account email
- [ ] Add Google credentials to `.env.local`

### 📧 Mailchimp Newsletter Setup
- [ ] Create Mailchimp account and audience/list
- [ ] Generate API key from Mailchimp dashboard
- [ ] Get your List/Audience ID
- [ ] Add Mailchimp credentials to `.env.local`
- [ ] Test newsletter subscription on your website
- [ ] Configure double opt-in and welcome emails in Mailchimp
- [ ] **Optional**: Set up interest groups in Mailchimp for segmentation
- [ ] **Optional**: Create custom merge fields for additional data collection

### 🎨 Customization
- [ ] Update hero section content in `src/config/site.ts`
- [ ] Customize navigation items if needed
- [ ] Update privacy policy and terms with your contact information
- [ ] Replace placeholder contact emails with real ones

### 🚀 Testing
- [ ] Test newsletter subscription form
- [ ] Check `/admin/newsletter` page for Mailchimp stats and tags
- [ ] Visit `/newsletter-examples` to see different form types
- [ ] Test different signup sources and verify tagging in Mailchimp
- [ ] Verify Google Sheets data loading
- [ ] Test responsive design on mobile devices

### 🔄 Optional Enhancements
- [ ] Set up Google Analytics or other tracking
- [ ] Configure additional Mailchimp automation workflows
- [ ] Create custom interest groups for precise targeting
- [ ] Add more merge fields for detailed subscriber data
- [ ] Implement email templates in Mailchimp
- [ ] Set up automated welcome series based on tags/interests
- [ ] Create different newsletter forms for different pages
- [ ] Set up exit-intent popups with special tags

Your newsletter integration is now secure, user-friendly, and ready for production!
```

