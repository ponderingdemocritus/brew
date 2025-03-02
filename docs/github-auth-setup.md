# Setting Up GitHub Authentication in Supabase

This guide will walk you through the process of setting up GitHub authentication for your Loafs Brew Journal app.

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: Loafs Brew Journal (or any name you prefer)
   - **Homepage URL**: Your app's URL (e.g., `http://localhost:5173` for local development)
   - **Application description**: (Optional) A brief description of your app
   - **Authorization callback URL**: `https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback`
     - Replace `[YOUR_SUPABASE_PROJECT_ID]` with your actual Supabase project ID
4. Click "Register application"
5. You'll be provided with a **Client ID**
6. Generate a new **Client Secret** by clicking "Generate a new client secret"
7. Save both the Client ID and Client Secret (you'll need them for Supabase)

## Step 2: Configure GitHub Auth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** in the left sidebar
4. Click on **Providers**
5. Find **GitHub** in the list of providers
6. Toggle the switch to enable GitHub authentication
7. Enter the **Client ID** and **Client Secret** from your GitHub OAuth App
8. (Optional) Configure additional settings:
   - **Redirect URL**: Leave as default unless you have a specific redirect URL
   - **Domains**: If you're using custom domains, add them here
9. Click **Save**

## Step 3: Test GitHub Authentication

1. Run your app locally or deploy it
2. Navigate to the login page
3. Click "Sign in with GitHub"
4. You should be redirected to GitHub to authorize the application
5. After authorization, you should be redirected back to your app and logged in

## Troubleshooting

### Callback URL Issues

If you're getting errors about the callback URL:

- Make sure the callback URL in your GitHub OAuth App exactly matches the one Supabase expects
- The URL should be `https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback`

### CORS Issues

If you're experiencing CORS issues:

- Make sure your app's domain is allowed in the Supabase Authentication settings
- For local development, `http://localhost:5173` (or your local port) should be added

### Authentication Flow Issues

If the authentication flow isn't working:

- Check the browser console for errors
- Verify that your GitHub OAuth App is properly configured
- Ensure your Supabase project has the correct GitHub Client ID and Secret

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
