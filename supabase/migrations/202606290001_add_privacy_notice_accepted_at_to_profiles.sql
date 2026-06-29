alter table public.profiles
add column if not exists privacy_notice_accepted_at timestamptz;

create or replace function public.accept_privacy_notice()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
	updated_profile public.profiles;
begin
	update public.profiles
	set privacy_notice_accepted_at = now()
	where id = auth.uid()
	returning * into updated_profile;

	if updated_profile is null then
		raise exception 'Profile not found for current user.';
	end if;

	return updated_profile;
end;
$$;

revoke all on function public.accept_privacy_notice() from public;
grant execute on function public.accept_privacy_notice() to authenticated;
