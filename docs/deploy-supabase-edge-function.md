# Deploying a Supabase Edge Function

This guide explains how to deploy an existing Supabase Edge Function using the Supabase CLI.

## 1. Log in to Supabase

Authenticate the Supabase CLI with your account:

```bash
supabase login
```

This will open your browser and prompt you to log in.

---

## 2. Link your local project

If you haven't already linked your local project to your Supabase project, run:

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
```

You can find your project reference in the Supabase Dashboard URL:

```
https://supabase.com/dashboard/project/<YOUR_PROJECT_REF>
```

---

## 3. Deploy the Edge Function

Deploy the function by specifying its directory name:

```bash
supabase functions deploy <FUNCTION_NAME>
```

For example:

```bash
supabase functions deploy generate-reflection-analysis
```

Once deployed, the CLI will confirm the deployment.

---

## 4. Verify the deployment

Open the Supabase Dashboard and navigate to:

**Edge Functions**

You should see your function listed and available to invoke.

---

## 5. Redeploy after making changes

Whenever you modify the function, redeploy it using the same command:

```bash
supabase functions deploy <FUNCTION_NAME>
```

The existing deployment will be updated with the latest version of your code.