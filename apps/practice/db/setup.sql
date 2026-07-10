-- ==========================================================================
-- Practice project setup: creates the engine's tables, security rules and
-- image storage. This is the Step 2 schema, combined into one script for a
-- single paste into the Supabase SQL editor.
--
-- Running this creates EMPTY tables in this project only. It adds no content
-- (the sample Riverside data is a separate script, seed.sql). It does not
-- touch anything outside this Supabase project.
-- ==========================================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- pages -------------------------------------------------------------------
create table public.pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  meta_title       text,
  meta_description text,
  blocks           jsonb not null default '[]'::jsonb,
  published        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index pages_published_idx on public.pages (published);

create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- site_settings -----------------------------------------------------------
create table public.site_settings (
  id              boolean primary key default true,
  school_name     text not null,
  contact_email   text not null,
  contact_phone   text,
  booking_enabled boolean not null default false,
  social_links    jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now(),
  constraint site_settings_single_row check (id)
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- media -------------------------------------------------------------------
create table public.media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt          text not null default '',
  created_at   timestamptz not null default now()
);

-- Row Level Security ------------------------------------------------------
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;

create policy pages_public_read on public.pages
  for select to anon using (published = true);
create policy pages_admin_read on public.pages
  for select to authenticated using (true);
create policy pages_admin_insert on public.pages
  for insert to authenticated with check (true);
create policy pages_admin_update on public.pages
  for update to authenticated using (true) with check (true);
create policy pages_admin_delete on public.pages
  for delete to authenticated using (true);

create policy site_settings_public_read on public.site_settings
  for select to anon using (true);
create policy site_settings_admin_read on public.site_settings
  for select to authenticated using (true);
create policy site_settings_admin_insert on public.site_settings
  for insert to authenticated with check (true);
create policy site_settings_admin_update on public.site_settings
  for update to authenticated using (true) with check (true);

create policy media_public_read on public.media
  for select to anon using (true);
create policy media_admin_read on public.media
  for select to authenticated using (true);
create policy media_admin_insert on public.media
  for insert to authenticated with check (true);
create policy media_admin_delete on public.media
  for delete to authenticated using (true);

-- Image storage -----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy media_objects_public_read on storage.objects
  for select to anon using (bucket_id = 'media');
create policy media_objects_admin_read on storage.objects
  for select to authenticated using (bucket_id = 'media');
create policy media_objects_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy media_objects_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media');
