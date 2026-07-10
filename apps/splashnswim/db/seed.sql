-- ==========================================================================
-- SplashNSwim content, for the shared practice database.
--
-- The tables already exist (created for the practice run), so this script
-- does not create anything. It replaces the site settings and the home/about
-- pages with SplashNSwim content. Safe to run more than once.
-- ==========================================================================

insert into public.site_settings (id, school_name, contact_email, contact_phone, booking_enabled)
values (true, 'SplashNSwim', 'hello@splashnswim.net', null, false)
on conflict (id) do update set
  school_name = excluded.school_name,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  booking_enabled = excluded.booking_enabled;

-- Home page ---------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'home',
  'SplashNSwim | Premium 1-to-1 swimming lessons',
  true,
  '[
    {
      "id": "home_hero",
      "type": "hero",
      "heading": "Every child learns faster, one to one",
      "subheading": "Premium private swimming lessons in calm pools across Eastwood, Benfleet and Rochford. Just your child and their teacher, every single lesson.",
      "primaryCta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" },
      "secondaryCta": { "label": "See our prices", "href": "#home_prices" }
    },
    {
      "id": "home_why",
      "type": "rich_text",
      "heading": "Why one to one?",
      "content": "Group lessons split a teacher between many children. We do the opposite. At SplashNSwim your child has their teacher to themselves for the whole lesson, so they are seen, encouraged and gently stretched every minute they are in the water. It is calmer, safer and quicker. Nervous swimmers settle sooner, confident swimmers go further, and every lesson is shaped around your child rather than the group."
    },
    {
      "id": "home_prices",
      "type": "pricing_table",
      "heading": "Our lessons",
      "tiers": [
        {
          "name": "Children 1-to-1",
          "price": "£99.99 / month",
          "description": "Private weekly lessons for ages 4 and up.",
          "features": ["A dedicated teacher every week", "Choice of Eastwood, Benfleet or Rochford", "A plan tailored to your child", "Calm, distraction-free private pool"],
          "highlighted": true,
          "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Adult 1-to-1",
          "price": "£99.99 / month",
          "description": "Evening lessons for ages 16 and up.",
          "features": ["One-to-one with your own teacher", "Evenings, 7pm to 8pm", "Build confidence, technique or stamina", "Available at all three pools"],
          "highlighted": false,
          "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Additional needs 1-to-1",
          "price": "From £99.99 / month",
          "description": "Patient, fully tailored teaching.",
          "features": ["Understanding, experienced teachers", "A quiet, private pool", "Lessons that move at your pace", "A calm, familiar routine"],
          "highlighted": false,
          "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
        }
      ]
    },
    {
      "id": "home_approach",
      "type": "rich_text",
      "heading": "In the water with your child",
      "content": "Our teachers get into the pool alongside beginners, building trust from the very first lesson. Sessions run in small, private pools with no crowds and no queues, so your child can focus and feel safe. We welcome swimmers of every age and ability, from first splashes to stroke refinement, and we are proud to teach children with additional needs at a pace that is right for them."
    },
    {
      "id": "home_faq",
      "type": "faq",
      "heading": "Questions parents ask",
      "items": [
        { "question": "What should my child bring?", "answer": "A swimming costume, a towel, and goggles if they have them. We will sort the rest." },
        { "question": "Where are your pools?", "answer": "We teach at private pools in Eastwood, Benfleet and Rochford, all in south Essex." },
        { "question": "Do you teach adults?", "answer": "Yes. Our adult one-to-one lessons run in the evenings, from 7pm to 8pm, at all three pools." },
        { "question": "Can you support additional needs?", "answer": "Absolutely. Our teachers are experienced in tailoring lessons for swimmers with additional needs, at a pace that suits them." },
        { "question": "How do I book?", "answer": "Choose Book a lesson, then pick a pool and a time that works for you." }
      ]
    },
    {
      "id": "home_cta",
      "type": "cta_banner",
      "heading": "Ready to get started?",
      "body": "Give your child the confidence that comes from lessons made just for them.",
      "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
    },
    {
      "id": "home_contact",
      "type": "contact",
      "heading": "Get in touch",
      "address": "Eastwood, Benfleet and Rochford, south Essex",
      "email": "hello@splashnswim.net",
      "showEnquiryForm": true
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;

-- About page --------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'about',
  'About SplashNSwim',
  true,
  '[
    {
      "id": "about_intro",
      "type": "rich_text",
      "heading": "A swim school with a difference",
      "content": "SplashNSwim specialises in one-to-one swimming lessons, giving every swimmer the individual attention they need to grow in confidence and ability. With private pools in Eastwood, Benfleet and Rochford, we provide calm, distraction-free environments that help swimmers learn faster than in group classes. We teach all ages, from babies to adults, and we are proud to support swimmers with additional needs, so swimming is open to everyone. Our goal is simple: to help every swimmer feel safe, confident and capable in the water."
    },
    {
      "id": "about_pool",
      "type": "rich_text",
      "heading": "In the water with your child",
      "content": "Our teachers get into the pool alongside beginners, building trust and confidence from the very first lesson. It is a gentle, encouraging approach that helps nervous swimmers settle quickly and start to enjoy the water."
    },
    {
      "id": "about_cta",
      "type": "cta_banner",
      "heading": "Come and swim with us",
      "body": "Book a one-to-one lesson at a pool near you.",
      "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;
