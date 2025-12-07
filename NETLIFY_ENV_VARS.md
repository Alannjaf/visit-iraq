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

## Build Error Troubleshooting

If you see this error during build:
```
Error: No secret server key provided. Please copy your key from the Stack dashboard and put it in the STACK_SECRET_SERVER_KEY environment variable.
```

**Solution:** Make sure `STACK_SECRET_SERVER_KEY` is set in Netlify environment variables before building.
