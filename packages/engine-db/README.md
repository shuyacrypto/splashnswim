# engine-db

The database layer: schema, migrations, Row Level Security and a typed client.

## What is here

- `supabase/migrations/` - the SQL that builds the database, applied in order:
  - `20260710090000_initial_schema.sql` - the tables (`pages`, `site_settings`, `media`).
  - `20260710090100_rls_policies.sql` - Row Level Security on every table.
- `supabase/seed.sql` - sample content for local development.
- `src/` - the typed Supabase client used by the rest of the engine.

## Security model

One Supabase project per school, so there is no "school id" column anywhere.

- **anon** (the public website): may read published pages and public settings only.
- **authenticated** (a signed-in school admin): full read and write access.
- **service_role** (trusted server code): bypasses Row Level Security; used only
  with the secret service-role key, never in the browser.

## Applying the migrations (done later, when a school's Supabase project exists)

These files are written now but are only applied once a real Supabase project
has been created for a school. At that point, using the Supabase CLI:

```bash
supabase link --project-ref <the-school-project-ref>
supabase db push        # applies the migrations
supabase db reset        # local only: rebuilds the database and runs seed.sql
```

Connection secrets go in a local `.env` file, based on `.env.example`. The real
`.env` is never committed.
