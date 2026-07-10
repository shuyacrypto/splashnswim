-- Initial schema for the swim school engine.
--
-- There is one Supabase project per school, so there is deliberately no
-- "school id" column anywhere: every row in this database already belongs
-- to a single school.

create extension if not exists "pgcrypto";

-- Keeps an updated_at column current whenever a row changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- pages
-- A marketing page is an ordered list of CMS blocks stored as JSONB. The
-- block content is validated against engine-contracts before it is ever
-- written, so the database trusts the shape of this column.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- site_settings
-- Site-wide settings. Exactly one row is allowed: the id column can only ever
-- hold the value true, so a second row cannot be inserted.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- media
-- Metadata for images uploaded through the admin panel. The file itself
-- lives in Supabase Storage; this row records where it is and its alt text.
-- ---------------------------------------------------------------------------
create table public.media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt          text not null default '',
  created_at   timestamptz not null default now()
);
