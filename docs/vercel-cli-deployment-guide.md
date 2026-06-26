# Deploying to Vercel with the Vercel CLI

This guide explains how to deploy a Vite/React project, such as Duality, to Vercel from the terminal using the Vercel CLI.

## 1. Install the Vercel CLI

Install the CLI globally:

```bash
npm install -g vercel
```

Check that it installed correctly:

```bash
vercel --version
```

If you see `command not found: vercel`, close and reopen your terminal, then try again.

## 2. Log in to Vercel

Run:

```bash
vercel login
```

Choose the same login method you used for your Vercel account, for example GitHub.

You can confirm which account is active with:

```bash
vercel whoami
```

## 3. Link the local project to Vercel

From the root of your project, run:

```bash
vercel
```

The first time you run this, Vercel will ask setup questions.

Recommended answers:

```text
Set up and deploy? Yes
Which scope? Select your personal account or team
Link to existing project? Yes
Select project: duality
```

This creates a `.vercel` folder in your project. It links your local folder to the correct Vercel project.

Do not manually edit the `.vercel` folder.

## 4. Add environment variables

For a Vite app, add your frontend environment variables in the Vercel dashboard.

Typical Duality variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not add private backend secrets to Vercel unless your frontend deployment genuinely needs server-side functions.

Do not add:

```env
OPENAI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=
```

Those should stay in Supabase secrets or the correct backend environment.

## 5. Deploy a preview build

To deploy a preview version from your current local code, run:

```bash
vercel
```

Vercel will build and deploy the project, then return a preview URL.

Use preview deployments to test changes before production.

## 6. Deploy to production

To deploy to the production domain, run:

```bash
vercel --prod
```

For Duality, this should deploy to:

```text
https://discoverduality.vercel.app
```

## 7. Recommended Git-based workflow

For normal development, the simplest workflow is still to push to GitHub and let Vercel deploy automatically:

```bash
git add .
git commit -m "Add Vercel analytics"
git push origin main
```

If the Vercel project is connected to GitHub, every push to `main` will trigger a production deployment.

Use the CLI when you want to:

- test a local preview deployment
- deploy without waiting for GitHub
- inspect project setup
- confirm the Vercel account connection

## 8. React Router SPA rewrite

If your app uses React Router and a page refresh on routes like `/reflections` gives a 404, add a `vercel.json` file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy:

```bash
vercel --prod
```

## 9. Common commands

Check CLI version:

```bash
vercel --version
```

Check logged-in account:

```bash
vercel whoami
```

Deploy preview:

```bash
vercel
```

Deploy production:

```bash
vercel --prod
```

Log out:

```bash
vercel logout
```

## 10. Troubleshooting

### `command not found: vercel`

Install the CLI:

```bash
npm install -g vercel
```

Then restart your terminal.

### Node engine warnings

If you see Node compatibility warnings, check your Node version:

```bash
node --version
```

Using a long-term support version such as Node 22 is usually safer than using a bleeding-edge version.

### Environment variables are undefined

Make sure the variables are added in Vercel and begin with `VITE_` if they need to be available in the browser.

After changing environment variables, redeploy the project.

### Production still shows old code

Make sure you deployed production, not preview:

```bash
vercel --prod
```

Or push to the production branch connected in Vercel, usually `main`.

## Recommended Duality setup

For the MVP, use:

```text
Frontend: Vercel
Domain: discoverduality.vercel.app
Auth: Supabase Auth
Database: Supabase PostgreSQL
AI processing: Supabase Edge Functions
Secrets: Supabase secrets
```

This keeps the deployment simple and avoids unnecessary infrastructure while you focus on shipping and user feedback.
