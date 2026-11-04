-- SonoPass accounts: profiles, synced progress, signed-in devices (max 2) and purchase entitlements.
-- Run in the Supabase SQL editor, or with `supabase db push`.

-- Profiles ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  exam_focus text,            -- registry id, e.g. 'spi', 'vascular', 'abdomen'
  exam_date date,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Synced study progress: { stats, completedTopics } as stored by the app --------
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Signed-in devices --------------------------------------------------------------
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  device_id text not null,
  label text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, device_id)
);
create index if not exists devices_user_id_idx on public.devices (user_id);

-- Purchases (written only by the server / store webhooks) -------------------------
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'monthly', 'lifetime')),
  status text not null default 'active',
  expires_at timestamptz,
  source text,                -- 'app_store' | 'play_store' | 'web' | 'manual'
  updated_at timestamptz not null default now()
);

-- Row level security: users only ever see their own rows ---------------------------
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.devices enable row level security;
alter table public.entitlements enable row level security;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
drop policy if exists "own profile write" on public.profiles;
create policy "own profile write" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own progress read" on public.user_progress;
create policy "own progress read" on public.user_progress for select using (auth.uid() = user_id);

drop policy if exists "own devices read" on public.devices;
create policy "own devices read" on public.devices for select using (auth.uid() = user_id);
drop policy if exists "own devices remove" on public.devices;
create policy "own devices remove" on public.devices for delete using (auth.uid() = user_id);

drop policy if exists "own entitlement read" on public.entitlements;
create policy "own entitlement read" on public.entitlements for select using (auth.uid() = user_id);

-- New users get a profile and a free entitlement -------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  insert into public.entitlements (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Device limit ---------------------------------------------------------------------
-- Registers this device for the signed-in user and signs out (removes) the least
-- recently used devices beyond the limit. Returns the labels of removed devices.
create or replace function public.register_device(p_device_id text, p_label text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  max_devices constant int := 2;
  removed text[];
begin
  if uid is null then
    raise exception 'not authenticated';
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

-- True while this device is still one of the user's signed-in devices.
create or replace function public.check_device(p_device_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  update devices set last_seen_at = now()
  where user_id = auth.uid() and device_id = p_device_id;
  return found;
end;
$$;

-- Progress is only saved from a registered device, so a signed-out device stops syncing.
create or replace function public.save_progress(p_device_id text, p_data jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_at timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not exists (select 1 from devices where user_id = auth.uid() and device_id = p_device_id) then
    raise exception 'device signed out' using errcode = 'P0001', hint = 'device_revoked';
  end if;

  insert into user_progress (user_id, data, updated_at)
  values (auth.uid(), p_data, saved_at)
  on conflict (user_id) do update set data = excluded.data, updated_at = excluded.updated_at;
  return saved_at;
end;
$$;

revoke all on function public.register_device(text, text) from public;
revoke all on function public.check_device(text) from public;
revoke all on function public.save_progress(text, jsonb) from public;
grant execute on function public.register_device(text, text) to authenticated;
grant execute on function public.check_device(text) to authenticated;
grant execute on function public.save_progress(text, jsonb) to authenticated;
