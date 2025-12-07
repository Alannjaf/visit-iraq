# Netlify Environment Variables

Set these environment variables in your Netlify dashboard (Site settings > Environment variables):

## Required Environment Variables

### Database

- `DATABASE_URL` - Your Neon PostgreSQL connection string

### Stack Auth (Neon Auth)

- `NEXT_PUBLIC_STACK_PROJECT_ID` - Your Stack Auth project ID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Your Stack Auth publishable client key
- `STACK_SECRET_SERVER_KEY` - Your Stack Auth secret server key

### Application URL

- `NEXT_PUBLIC_APP_URL` - Your Netlify site URL (e.g., `https://your-site.netlify.app`)

### Admin Access

- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD` - Admin password for login

## How to Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Click **Add a variable**
4. Add each variable with its value
5. Make sure to set them for **Production**, **Deploy previews**, and **Branch deploys** as needed

## Important Notes

- **`STACK_SECRET_SERVER_KEY` is REQUIRED during build time** - Without it, the build will fail with "No secret server key provided"
- `NEXT_PUBLIC_*` variables are exposed to the browser, so make sure they're safe to expose
- Never commit `.env.local` or `.env` files to git
- Update `NEXT_PUBLIC_APP_URL` after your first deployment with the actual Netlify URL

## Stack Auth Domain Whitelisting (IMPORTANT!)

After deploying to Netlify, you **MUST** whitelist your Netlify domain in Stack Auth:

1. Go to your [Stack Auth Dashboard](https://stack-auth.com/dashboard)
2. Navigate to your project settings
3. Find the **"Trusted Domains"** or **"Allowed Redirect URLs"** section
4. Add your Netlify domain(s):
   - `https://your-site.netlify.app` (your main domain)
   - `https://your-site.netlify.app/*` (to allow all paths)
   - If you have a custom domain, add that too: `https://yourdomain.com` and `https://yourdomain.com/*`

**Without this step, OAuth (Google, etc.) login will fail with:**
```
"REDIRECT_URL_NOT_WHITELISTED"
"Redirect URL not whitelisted. Did you forget to add this domain to the trusted domains list on the Stack Auth dashboard?"
```

## Build Error Troubleshooting

If you see this error during build:
```
Error: No secret server key provided. Please copy your key from the Stack dashboard and put it in the STACK_SECRET_SERVER_KEY environment variable.
```

**Solution:** Make sure `STACK_SECRET_SERVER_KEY` is set in Netlify environment variables before building.
