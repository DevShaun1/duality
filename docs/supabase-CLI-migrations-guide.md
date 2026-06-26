# Creating and Pushing Supabase Migrations

This guide explains how to create database migrations locally and deploy
them to your hosted Supabase project using the Supabase CLI.

## Prerequisites

-   Supabase CLI installed
-   Logged into the Supabase CLI
-   Your project already contains a `supabase/` directory

## 1. Log in to Supabase

``` bash
npx supabase login
```

Follow the browser authentication flow.

## 2. Link your local project

Run this once for each project.

``` bash
npx supabase link --project-ref <your-project-ref>
```

You can find the project reference in the Supabase Dashboard under
**Project Settings → General**.

## 3. Create a new migration

``` bash
npx supabase migration new create_pattern_reviews
```

A new SQL file will be created:

``` text
supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_create_pattern_reviews.sql
```

## 4. Add your SQL

Example:

``` sql
create table pattern_reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamptz not null default now()
);
```

## 5. Push migrations

Apply all pending migrations to your hosted Supabase project:

``` bash
npx supabase db push
```

The CLI will execute any migrations that have not yet been applied.

## Recommended Workflow

1.  Create a migration.
2.  Add your SQL.
3.  Run `npx supabase db push`.
4.  Verify the changes in the Supabase Dashboard.
5.  Commit the migration file to Git.

## Best Practices

-   Never edit an old migration that has already been applied.
-   Create a new migration for every schema change.
-   Commit migration files alongside the code that depends on them.
-   Prefer migrations over making schema changes directly in the SQL
    Editor.

## Useful Commands

``` bash
# Log in
npx supabase login

# Link project
npx supabase link --project-ref <project-ref>

# Create migration
npx supabase migration new <migration-name>

# Push migrations
npx supabase db push
```
