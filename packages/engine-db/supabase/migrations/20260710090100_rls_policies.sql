-- Row Level Security for every table (engine rule: RLS from day one, no
-- exceptions).
--
-- The security model is simple because there is one project per school:
--   * anon          = a member of the public viewing the live website.
--   * authenticated = a signed-in school admin.
--   * service_role  = trusted server-side code; it bypasses RLS entirely and
--                     is only ever used with the secret service-role key.
--
-- Because there are no parent/customer accounts in v1, every signed-in user
-- is an admin and is trusted with full read and write access.

alter table public.pages enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

-- The public may read only pages that have been published.
create policy pages_public_read on public.pages
  for select to anon
  using (published = true);

-- Admins may read every page, including unpublished drafts.
create policy pages_admin_read on public.pages
  for select to authenticated
  using (true);

create policy pages_admin_insert on public.pages
  for insert to authenticated
  with check (true);

create policy pages_admin_update on public.pages
  for update to authenticated
  using (true)
  with check (true);

create policy pages_admin_delete on public.pages
  for delete to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------

-- Settings such as school name and contact details are shown on the public
-- site, so the public may read them.
create policy site_settings_public_read on public.site_settings
  for select to anon
  using (true);

create policy site_settings_admin_read on public.site_settings
  for select to authenticated
  using (true);

-- Admins may create the single settings row once, then update it.
create policy site_settings_admin_insert on public.site_settings
  for insert to authenticated
  with check (true);

create policy site_settings_admin_update on public.site_settings
  for update to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------------

-- Images are shown on the public site, so their metadata is publicly readable.
create policy media_public_read on public.media
  for select to anon
  using (true);

create policy media_admin_read on public.media
  for select to authenticated
  using (true);

create policy media_admin_insert on public.media
  for insert to authenticated
  with check (true);

create policy media_admin_delete on public.media
  for delete to authenticated
  using (true);
