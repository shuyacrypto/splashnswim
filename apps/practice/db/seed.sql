-- ==========================================================================
-- Sample content for the practice run: the Riverside Swim School. Run this
-- after setup.sql. It is safe to run more than once (existing rows are kept).
-- ==========================================================================

insert into public.site_settings (id, school_name, contact_email, contact_phone, booking_enabled)
values (
  true,
  'Riverside Swim School',
  'hello@riverside-swim.example',
  '01234 567890',
  false
)
on conflict (id) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'home',
  'Welcome to Riverside Swim School',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "Learn to swim with confidence",
      "subheading": "Friendly lessons for all ages in the heart of Riverside.",
      "primaryCta": { "label": "View our timetable", "href": "/timetable" }
    },
    {
      "id": "blk_intro",
      "type": "rich_text",
      "heading": "About our school",
      "content": "We have been teaching children and adults to swim for over twenty years. Our patient, qualified teachers keep class sizes small so every swimmer gets the attention they deserve."
    },
    {
      "id": "blk_faq",
      "type": "faq",
      "heading": "Common questions",
      "items": [
        { "question": "What should my child bring?", "answer": "A swimming costume, a towel and goggles if they have them." },
        { "question": "Do you offer adult lessons?", "answer": "Yes. We run adult beginner and improver classes on weekday evenings." }
      ]
    },
    {
      "id": "blk_contact",
      "type": "contact",
      "heading": "Get in touch",
      "email": "hello@riverside-swim.example",
      "phone": "01234 567890",
      "showEnquiryForm": true
    }
  ]'::jsonb
)
on conflict (slug) do nothing;
