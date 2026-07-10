-- ==========================================================================
-- SplashNSwim content, for the shared practice database.
--
-- The tables already exist (created for the practice run), so this script
-- does not create anything. It replaces the site settings and the home/about
-- pages with SplashNSwim content. It overwrites the earlier Riverside sample
-- (that project is a throwaway), and is safe to run more than once.
-- ==========================================================================

insert into public.site_settings (id, school_name, contact_email, contact_phone, booking_enabled)
values (
  true,
  'SplashNSwim',
  'hello@splashnswim.net',
  null,
  false
)
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
      "heading": "Helping every child progress faster with 1-to-1 tuition",
      "subheading": "Premium one-to-one swimming lessons at calm, private pools in Eastwood, Benfleet and Rochford.",
      "primaryCta": { "label": "Book now", "href": "https://octoswim.co.uk/book/splashnswim" },
      "secondaryCta": { "label": "About us", "href": "/about" }
    },
    {
      "id": "home_why",
      "type": "rich_text",
      "heading": "Why one-to-one?",
      "content": "With the full attention of a dedicated instructor, every lesson is tailored to your swimmer. No queues, no distractions, just focused, patient teaching in a calm private pool. It is how swimmers of every age and ability progress faster and feel safe in the water."
    },
    {
      "id": "home_prices",
      "type": "pricing_table",
      "heading": "Our lessons",
      "tiers": [
        {
          "name": "Child 1-to-1",
          "price": "£99.99 / month",
          "description": "For swimmers aged 3 and over.",
          "features": ["A dedicated instructor every week", "Choice of Eastwood, Benfleet or Rochford", "A lesson plan tailored to your child"],
          "highlighted": true,
          "cta": { "label": "Book now", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Adult 1-to-1",
          "price": "£99.99 / month",
          "description": "For ages 16 and over.",
          "features": ["Evening sessions, 7pm to 8pm", "Build confidence or refine technique", "Available at all three pools"],
          "highlighted": false,
          "cta": { "label": "Book now", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Additional needs 1-to-1",
          "price": "From £99.99 / month",
          "description": "Calm, patient, fully tailored sessions.",
          "features": ["Experienced, understanding instructors", "A quiet, private pool", "Lessons that move at your pace"],
          "highlighted": false,
          "cta": { "label": "Book now", "href": "https://octoswim.co.uk/book/splashnswim" }
        }
      ]
    },
    {
      "id": "home_faq",
      "type": "faq",
      "heading": "Common questions",
      "items": [
        { "question": "What should my child bring?", "answer": "A swimming costume, a towel, and goggles if they have them." },
        { "question": "Where are your pools?", "answer": "We teach at private pools in Eastwood, Benfleet and Rochford." },
        { "question": "Do you teach adults?", "answer": "Yes. Our adult one-to-one lessons run in the evenings, from 7pm to 8pm." },
        { "question": "Can you support additional needs?", "answer": "Absolutely. Our instructors are experienced in tailoring lessons for swimmers with additional needs." }
      ]
    },
    {
      "id": "home_cta",
      "type": "cta_banner",
      "heading": "Ready to make a splash?",
      "body": "Give your swimmer the confidence that comes with one-to-one attention.",
      "cta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" }
    },
    {
      "id": "home_contact",
      "type": "contact",
      "heading": "Get in touch",
      "address": "Eastwood, Benfleet and Rochford, Essex",
      "email": "hello@splashnswim.net",
      "showEnquiryForm": true
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  published = excluded.published,
  blocks = excluded.blocks;

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
      "heading": "About us",
      "content": "SplashNSwim is a swim school with a difference. We specialise in one-to-one swimming lessons, giving every swimmer the individual attention they need to grow in confidence and ability. With private pools in Benfleet, Eastwood and Rochford, we provide calm, distraction-free environments that help swimmers learn faster than in group classes. Our experienced instructors work with swimmers of all ages, from babies to teens, and we are proud to support children with additional needs, so swimming is accessible for everyone. Our goal is simple: to make every swimmer feel safe, confident and capable in the water."
    },
    {
      "id": "about_pool",
      "type": "rich_text",
      "heading": "In the pool with your swimmer",
      "content": "Our instructors get into the pool with beginners, building trust and confidence from the very first lesson. It is a gentle, encouraging approach that helps nervous swimmers settle quickly and enjoy their time in the water."
    },
    {
      "id": "about_cta",
      "type": "cta_banner",
      "heading": "Come and swim with us",
      "body": "Book a one-to-one lesson at a pool near you.",
      "cta": { "label": "Book now", "href": "https://octoswim.co.uk/book/splashnswim" }
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  published = excluded.published,
  blocks = excluded.blocks;
