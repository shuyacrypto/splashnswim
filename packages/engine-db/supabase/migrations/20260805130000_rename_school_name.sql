-- Renames site_settings.school_name to business_name, following the
-- engine's generalization beyond swim schools only. Safe to run more than
-- once (guarded by a column-existence check).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'school_name'
  ) then
    alter table public.site_settings rename column school_name to business_name;
  end if;
end $$;
