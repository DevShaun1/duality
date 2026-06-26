create table public.pattern_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  reflection_ids uuid[] not null,
  overview text not null,
  recurring_themes jsonb not null default '[]'::jsonb,
  emotional_patterns jsonb not null default '[]'::jsonb,
  recurring_assumptions jsonb not null default '[]'::jsonb,
  signs_of_growth jsonb not null default '[]'::jsonb,
  another_side text not null,
  reflection_question text not null
);

create index pattern_reviews_user_created_at_idx on public.pattern_reviews (user_id, created_at desc);

alter table public.pattern_reviews enable row level security;

create policy "Users can view their own pattern reviews"
on public.pattern_reviews
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert their own pattern reviews"
on public.pattern_reviews
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own pattern reviews"
on public.pattern_reviews
for delete
using ((select auth.uid()) = user_id);
