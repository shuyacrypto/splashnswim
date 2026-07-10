# engine-admin

The constrained admin panel, as a kit of generic React screens.

## What this is

A set of ready-made screens a non-technical school admin uses:

- **PagesScreen** - list pages, create a page, publish/unpublish, delete.
- **PageEditorScreen** - edit a page's details and its content blocks.
- **BlockEditor** - add, reorder, edit and remove the ten block types.
- **SettingsScreen** - edit school details, social links and the booking toggle.
- **MediaScreen** - upload and delete images.

The panel is deliberately plain and **identical for every school**. It is never
restyled per client: fonts, colours and layout are the skin's concern, not the
admin's.

## How it is used

The screens are prop-driven. They receive data and hand changes back through
callbacks. They do **not** talk to the database. The consuming app (a school
skin, from build-order step 5) supplies those callbacks, wiring them to
`engine-cms` inside server actions, and provides Supabase authentication so
only signed-in admins can reach the panel.

## Constraints enforced here

- Admins choose from the fixed set of ten block types and cannot invent new ones.
- There is no way to change design, layout, fonts or colours.
- Every destructive action (deleting a page or image, removing a block) asks for
  confirmation first.

## Requirements in the consuming app

- React 18 or 19.
- Tailwind CSS configured to scan this package, so its utility classes are built.
