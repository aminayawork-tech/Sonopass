-- Make an existing account an admin (full Pro, no device limit, admin pages).
-- 1. Sign up in the app or on sonopass.com with the email you want to use.
-- 2. Replace YOUR-EMAIL below (keep the quotes), paste into Supabase → SQL Editor, and Run.

insert into public.admins (user_id, note)
select id, 'owner test account' from auth.users where email = lower('YOUR-EMAIL')
on conflict (user_id) do nothing;

insert into public.entitlements (user_id, plan, status, expires_at, source, updated_at)
select id, 'lifetime', 'active', null, 'admin', now() from auth.users where email = lower('YOUR-EMAIL')
on conflict (user_id) do update
  set plan = 'lifetime', status = 'active', expires_at = null, source = 'admin', updated_at = now();

-- Check it worked (should list your email with plan = lifetime):
select u.email, e.plan, e.status, (a.user_id is not null) as is_admin
from auth.users u
left join public.entitlements e on e.user_id = u.id
left join public.admins a on a.user_id = u.id
where u.email = lower('YOUR-EMAIL');
