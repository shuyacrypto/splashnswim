-- Storage for images uploaded through the admin panel.
--
-- Files live in a Supabase Storage bucket called "media". Supabase enables
-- Row Level Security on storage.objects by default, so we add matching
-- policies here: the public may read images (they appear on the live site),
-- and signed-in admins may upload and delete them.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy media_objects_public_read on storage.objects
  for select to anon
  using (bucket_id = 'media');

create policy media_objects_admin_read on storage.objects
  for select to authenticated
  using (bucket_id = 'media');

create policy media_objects_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');

create policy media_objects_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media');
