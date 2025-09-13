# Cloudflare KV Setup Guide

This guide will help you set up Cloudflare KV storage for your AI Prompt Library to persist data in the cloud instead of localStorage.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Basic understanding of environment variables

## Step 1: Create a Cloudflare KV Namespace

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **KV**
3. Click **Create a namespace**
4. Name it something like `prompt-library-storage`
5. Click **Add**
6. Copy the **Namespace ID** (you'll need this later)

## Step 2: Get Your Account ID

1. In your Cloudflare dashboard, look at the right sidebar
2. Find your **Account ID** and copy it

## Step 3: Create an API Token

1. Go to **My Profile** > **API Tokens**
2. Click **Create Token**
3. Use the **Custom token** template
4. Configure the token:
   - **Token name**: `Prompt Library KV Access`
   - **Permissions**: 
     - Account: `Cloudflare Workers:Edit`
     - Zone Resources: `Include All zones`
   - **Account Resources**: `Include All accounts`
5. Click **Continue to summary**
6. Click **Create Token**
7. **Copy the token immediately** (you won't see it again)

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual values:
   ```env
   VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_namespace_id_here
   VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and look for messages about Cloudflare configuration
3. Create a category or prompt - it should now save to Cloudflare KV
4. Refresh the page - your data should persist

## Fallback Behavior

The app is designed with graceful fallbacks:
- If Cloudflare is not configured, it uses localStorage
- If Cloudflare API calls fail, it falls back to localStorage
- Data is always backed up to localStorage as well

## Troubleshooting

### "Cloudflare not configured" message
- Check that all three environment variables are set in `.env`
- Restart your development server after adding environment variables

### API errors (403, 401)
- Verify your API token has the correct permissions
- Check that your Account ID is correct
- Ensure the Namespace ID matches your KV namespace

### Network errors
- Check your internet connection
- Verify Cloudflare services are operational

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- API tokens should be treated as passwords
- Consider using different namespaces for development and production

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):
1. Set the environment variables in your hosting platform's dashboard
2. Use a separate KV namespace for production
3. Consider implementing rate limiting for API calls

## Migration from localStorage

If you have existing data in localStorage, the app will automatically sync it to Cloudflare KV on first load when properly configured.
