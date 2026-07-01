alter table public.profiles
add column if not exists has_seen_reflection_intro boolean not null default false;