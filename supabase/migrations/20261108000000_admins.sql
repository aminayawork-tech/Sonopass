-- Admin accounts: full Pro access, no 2-device limit, and access to the admin pages.
-- Rows are added by hand in the SQL editor (see supabase/admin/make-admin.sql); users cannot add themselves.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "own admin row read" on public.admins;
create policy "own admin row read" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.register_device(p_device_id text, p_label text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  max_devices int := 2;
  removed text[];
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  -- Admin (test) accounts can stay signed in on any number of devices
  if exists (select 1 from admins a where a.user_id = uid) then
    max_devices := 1000;
  end if;

  insert into devices (user_id, device_id, label)
  values (uid, p_device_id, left(p_label, 80))
  on conflict (user_id, device_id)
  do update set last_seen_at = now(), label = excluded.label;

  with ranked as (
    select id, label, row_number() over (order by last_seen_at desc, created_at desc) as rn
    from devices
    where user_id = uid
  ),
  gone as (
    delete from devices d
    using ranked r
    where d.id = r.id and r.rn > max_devices
    returning r.label
  )
  select coalesce(array_agg(label), '{}') into removed from gone;

  return jsonb_build_object('max_devices', max_devices, 'signed_out', to_jsonb(removed));
end;
$$;

revoke all on function public.register_device(text, text) from public;
grant execute on function public.register_device(text, text) to authenticated;
