-- ==========================================================================
-- SplashNSwim content, for the shared practice database.
--
-- The tables already exist (created for the practice run), so this script
-- does not create anything. It replaces the site settings and the marketing
-- pages with SplashNSwim content. Safe to run more than once.
--
-- Note on quoting: content deliberately avoids apostrophes so every value is
-- safe inside single-quoted SQL. Please keep it that way when editing here.
-- ==========================================================================

insert into public.site_settings (id, school_name, contact_email, contact_phone, booking_enabled)
values (true, 'SplashNSwim', 'info@splashnswim.net', null, false)
on conflict (id) do update set
  school_name = excluded.school_name,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  booking_enabled = excluded.booking_enabled;

-- Home page ---------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'home',
  'SplashNSwim | Private 1-to-1 swimming lessons in Essex',
  true,
  '[
    {
      "id": "home_hero",
      "type": "hero",
      "heading": "Every child learns faster, one to one",
      "subheading": "Premium private swimming lessons in calm pools across Eastwood, Benfleet and Ashingdon. Just your child and their teacher, every single lesson.",
      "backgroundImage": { "src": "/hero.jpg", "alt": "A SplashNSwim teacher supporting a young swimmer with a kickboard in a calm indoor pool" },
      "primaryCta": { "label": "Book a lesson", "href": "https://octoswim.co.uk/book/splashnswim" },
      "secondaryCta": { "label": "See our prices", "href": "/pricing" }
    },
    {
      "id": "home_why",
      "type": "rich_text",
      "heading": "Why one to one?",
      "content": "Group lessons split a teacher between many children. We do the opposite. At SplashNSwim your child has their teacher to themselves for the whole lesson, so they are seen, encouraged and gently stretched every minute they are in the water. It is calmer, safer and quicker. Nervous swimmers settle sooner, confident swimmers go further, and every lesson is shaped around your child rather than the group."
    },
    {
      "id": "home_types",
      "type": "rich_text",
      "heading": "Lessons for every swimmer",
      "content": "We teach three kinds of one to one lesson. Children from age four build water confidence, strong technique and vital safety skills. Adults from age sixteen learn from scratch or refine their strokes in calm evening sessions. And our SEN lessons give swimmers with additional needs patient, fully tailored teaching in a quiet, familiar pool. Every lesson is private, so it moves at exactly the right pace."
    },
    {
      "id": "home_prices",
      "type": "pricing_table",
      "heading": "Private lessons by pool",
      "tiers": [
        {
          "name": "Ashingdon",
          "price": "£100 / month",
          "description": "One-to-one lessons at our Ashingdon pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "A plan tailored to your swimmer"],
          "highlighted": true,
          "cta": { "label": "Book at Ashingdon", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Benfleet",
          "price": "£110 / month",
          "description": "One-to-one lessons at our Benfleet pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "A plan tailored to your swimmer"],
          "highlighted": false,
          "cta": { "label": "Book at Benfleet", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Eastwood",
          "price": "£120 / month",
          "description": "One-to-one lessons at our Eastwood pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "A plan tailored to your swimmer"],
          "highlighted": false,
          "cta": { "label": "Book at Eastwood", "href": "https://octoswim.co.uk/book/splashnswim" }
        }
      ]
    },
    {
      "id": "home_trust",
      "type": "rich_text",
      "heading": "Teaching you can trust",
      "content": "Your child is in safe, expert hands. Our teachers are STA qualified, DBS checked, safeguarding trained and hold paediatric first aid. We keep our pools warm and calm, get into the water alongside beginners, and follow a clear plan with regular milestones so you always know how your swimmer is progressing."
    },
    {
      "id": "home_reviews",
      "type": "rich_text",
      "heading": "What parents say",
      "content": "\"Placeholder review. Add a real parent quote here from the admin, ideally with a specific outcome such as swimming a width unaided.\"\nA parent, Ashingdon\n\n\"Placeholder review. Swap this for words from a happy family who saw their child grow in confidence.\"\nA parent, Benfleet"
    },
    {
      "id": "home_faq",
      "type": "faq",
      "heading": "Questions parents ask",
      "items": [
        { "question": "Can we try before we commit?", "answer": "Yes. Book a one to one taster lesson for £20 so your swimmer can meet their teacher and try the pool before you sign up." },
        { "question": "Do you offer a sibling discount?", "answer": "Yes. The first child pays the full monthly fee, and every additional sibling gets 10% off their fee." },
        { "question": "What should my child bring?", "answer": "A swimming costume, a towel, and goggles if they have them. We will sort the rest." },
        { "question": "Where are your pools?", "answer": "We teach at private pools in Eastwood, Benfleet and Ashingdon, all in south Essex." },
        { "question": "How does pricing work?", "answer": "Fees are monthly and depend on your pool: £100 at Ashingdon, £110 at Benfleet and £120 at Eastwood. Each monthly fee covers four lessons. When a month has five weeks, or a lesson is affected by a closure, your fee is adjusted to match the lessons that take place." },
        { "question": "Do you teach adults?", "answer": "Yes. Our adult one-to-one lessons are for ages 16 and up and run in the evenings, from 7pm to 8pm, at all three pools." },
        { "question": "Can you support additional needs?", "answer": "Absolutely. Our teachers are experienced in tailoring SEN lessons for swimmers with additional needs, at a pace that suits them, in a quiet and familiar pool." },
        { "question": "How do I book?", "answer": "Choose Book a lesson to pick a pool and a time, or send us an enquiry and we will help you get started." }
      ]
    },
    {
      "id": "home_taster_cta",
      "type": "cta_banner",
      "heading": "Try a lesson for £20",
      "body": "Book a one to one taster and see the difference private teaching makes.",
      "cta": { "label": "Book a £20 taster", "href": "/contact?type=taster" }
    },
    {
      "id": "home_contact",
      "type": "contact",
      "heading": "Get in touch",
      "address": "Eastwood, Benfleet and Ashingdon, south Essex",
      "email": "info@splashnswim.net",
      "showEnquiryForm": true
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;

-- Lessons page ------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'lessons',
  'Our lessons | SplashNSwim',
  true,
  '[
    {
      "id": "lessons_intro",
      "type": "rich_text",
      "heading": "One to one lessons for every swimmer",
      "content": "Every SplashNSwim lesson is private, with one teacher and one swimmer. That means the lesson is built entirely around your swimmer, moving faster when they are ready and slowing down when they need reassurance. Below is a little more about who we teach and what a lesson looks like."
    },
    {
      "id": "lessons_children",
      "type": "rich_text",
      "heading": "Children 1-to-1 (age 4 and up)",
      "content": "For children aged four and over, our one to one lessons build water confidence, strong stroke technique and the safety skills every child should have. With a teacher focused on them alone, children progress noticeably faster than in a busy group class. Lessons run on weekdays and weekends at all three pools, so it is easy to find a time that fits around school and family life."
    },
    {
      "id": "lessons_adult",
      "type": "rich_text",
      "heading": "Adult 1-to-1 (age 16 and up)",
      "content": "It is never too late to learn. Our adult lessons welcome complete beginners as well as swimmers who want to grow in confidence, build stamina or refine their strokes. Sessions are calm and private, with no crowds to feel self conscious about, and run in the evenings from 7pm to 8pm across all three pools."
    },
    {
      "id": "lessons_sen",
      "type": "rich_text",
      "heading": "SEN 1-to-1",
      "content": "We are proud to teach swimmers with additional needs. Our SEN lessons are patient and fully tailored, held in a quiet, warm and familiar pool with a teacher who takes the time to understand each swimmer. We move at a pace that feels right, building trust first and skills alongside it, so swimming becomes something to enjoy."
    },
    {
      "id": "lessons_expect",
      "type": "faq",
      "heading": "What to expect",
      "items": [
        { "question": "What should we bring?", "answer": "A swimming costume, a towel, and goggles if you have them. We will sort the rest." },
        { "question": "What happens in the first lesson?", "answer": "The teacher gets to know your swimmer, settles them in the water and starts building confidence straight away. There is no pressure, just a gentle, encouraging start." },
        { "question": "How long is a lesson?", "answer": "Lessons are one to one and run to a set time each week. Adult sessions run from 7pm to 8pm." },
        { "question": "Do teachers get in the water?", "answer": "Yes. With beginners our teachers get into the pool alongside them, which builds trust quickly and helps nervous swimmers relax." },
        { "question": "How quickly will we see progress?", "answer": "Because the lesson is entirely one to one, most swimmers progress faster than in group classes. We follow a clear plan with regular milestones so you can see how things are going." }
      ]
    },
    {
      "id": "lessons_cta",
      "type": "cta_banner",
      "heading": "Not sure where to start?",
      "body": "Book a £20 taster and let your swimmer try a private lesson first.",
      "cta": { "label": "Book a £20 taster", "href": "/contact?type=taster" }
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;

-- Pricing page ------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'pricing',
  'Prices | SplashNSwim',
  true,
  '[
    {
      "id": "pricing_intro",
      "type": "rich_text",
      "heading": "Simple pricing, by pool",
      "content": "All three lesson types, Children, Adult and SEN, are available at each of our pools. Your monthly fee depends only on the pool you choose. There is nothing hidden and no joining fee."
    },
    {
      "id": "pricing_table",
      "type": "pricing_table",
      "heading": "Monthly fees",
      "tiers": [
        {
          "name": "Ashingdon",
          "price": "£100 / month",
          "description": "One-to-one lessons at our Ashingdon pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "Children, Adult and SEN lessons"],
          "highlighted": true,
          "cta": { "label": "Book at Ashingdon", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Benfleet",
          "price": "£110 / month",
          "description": "One-to-one lessons at our Benfleet pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "Children, Adult and SEN lessons"],
          "highlighted": false,
          "cta": { "label": "Book at Benfleet", "href": "https://octoswim.co.uk/book/splashnswim" }
        },
        {
          "name": "Eastwood",
          "price": "£120 / month",
          "description": "One-to-one lessons at our Eastwood pool.",
          "features": ["A dedicated teacher every week", "Priced on four lessons a month", "Adjusted for closures or five-week months", "Children, Adult and SEN lessons"],
          "highlighted": false,
          "cta": { "label": "Book at Eastwood", "href": "https://octoswim.co.uk/book/splashnswim" }
        }
      ]
    },
    {
      "id": "pricing_extras",
      "type": "rich_text",
      "heading": "Tasters and discounts",
      "content": "New to us? Book a one to one taster lesson for £20 before you commit. It is the easiest way to meet your teacher and try the pool.\n\nBringing more than one child? The first child pays the full monthly fee and every additional sibling gets 10% off their fee.\n\nAbout the monthly fee: each fee covers four lessons a month. When a month has five weeks, or a lesson is affected by a closure, your fee is adjusted so you only pay for the lessons that take place.\n\nDeposit and notice: when you join we take a one month deposit, the same as your monthly fee. It is not an extra cost. We hold it and put it towards your final month when you decide to stop, as long as you give one month of notice."
    },
    {
      "id": "pricing_faq",
      "type": "faq",
      "heading": "Pricing questions",
      "items": [
        { "question": "What does the monthly fee cover?", "answer": "Four one to one lessons a month at your chosen pool." },
        { "question": "What happens in a five-week month or if there is a closure?", "answer": "Your fee is adjusted to match the lessons that actually take place, so you are never charged for a lesson that does not happen." },
        { "question": "How much is a taster?", "answer": "A one to one taster lesson is £20." },
        { "question": "How does the sibling discount work?", "answer": "The first child pays the full fee for their pool, and each additional sibling gets 10% off their monthly fee." },
        { "question": "Is there a deposit?", "answer": "Yes. When you join we take a deposit the same as one month of fees. We hold it and use it for your final month, so it is never money you lose." },
        { "question": "How do I stop lessons?", "answer": "Just give one month of notice. Your deposit covers that final month, so there is nothing more to pay." },
        { "question": "How do I pay and book?", "answer": "Choose Book a lesson to book through our booking system, or send an enquiry and we will help you get set up." }
      ]
    },
    {
      "id": "pricing_cta",
      "type": "cta_banner",
      "heading": "Ready to dive in?",
      "body": "Book a £20 taster or ask us anything, we are happy to help.",
      "cta": { "label": "Book a £20 taster", "href": "/contact?type=taster" }
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;

-- Venues page -------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'venues',
  'Our pools | SplashNSwim',
  true,
  '[
    {
      "id": "venues_intro",
      "type": "rich_text",
      "heading": "Calm, private pools across south Essex",
      "content": "We teach at three private pools in Eastwood, Benfleet and Ashingdon. Each one is warm, quiet and free of crowds, which is exactly the kind of place where nervous swimmers settle and confident swimmers thrive."
    },
    {
      "id": "venues_gallery",
      "type": "gallery",
      "heading": "Our three pools",
      "images": [
        { "src": "/venue-ashingdon.jpg", "alt": "SplashNSwim Ashingdon pool", "caption": "Ashingdon · from £100 a month" },
        { "src": "/venue-benfleet.jpg", "alt": "SplashNSwim Benfleet pool", "caption": "Benfleet · from £110 a month" },
        { "src": "/venue-eastwood.jpg", "alt": "SplashNSwim Eastwood pool", "caption": "Eastwood · from £120 a month" }
      ]
    },
    {
      "id": "venues_detail",
      "type": "rich_text",
      "heading": "Warm, private and close to home",
      "content": "Every pool is warm, private and free of crowds, so lessons feel calm from the very first splash. All three offer one to one lessons for children, adults and swimmers with additional needs. Ashingdon is a gentle place to begin, while Benfleet and Eastwood add weekend slots and evening sessions for adults from 7pm to 8pm. Choose whichever is easiest for you, the teaching is the same wherever you swim."
    },
    {
      "id": "venues_cta",
      "type": "cta_banner",
      "heading": "Find your nearest pool",
      "body": "Book a £20 taster at Eastwood, Benfleet or Ashingdon.",
      "cta": { "label": "Book a £20 taster", "href": "/contact?type=taster" }
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
      "content": "SplashNSwim specialises in one-to-one swimming lessons, giving every swimmer the individual attention they need to grow in confidence and ability. With private pools in Eastwood, Benfleet and Ashingdon, we provide calm, distraction-free environments that help swimmers learn faster than in group classes. We teach children from age four, adults from age sixteen, and swimmers with additional needs, so swimming is open to everyone. Our goal is simple: to help every swimmer feel safe, confident and capable in the water."
    },
    {
      "id": "about_values",
      "type": "rich_text",
      "heading": "What makes us different",
      "content": "Warm pools. Our water is kept at a comfortable temperature, so lessons feel welcoming from the first moment.\n\nTeachers in the water. With beginners our teachers get into the pool alongside them, building trust and confidence from the very first lesson.\n\nWeekly progress. We follow a structured plan with clear milestones and regular check-ins, so you always know how your swimmer is doing."
    },
    {
      "id": "about_trust",
      "type": "rich_text",
      "heading": "Qualified and safeguarding first",
      "content": "Every SplashNSwim teacher is STA qualified, DBS checked, safeguarding trained and holds paediatric first aid. The safety and wellbeing of every swimmer comes first, always, and our teaching is warm, patient and encouraging."
    },
    {
      "id": "about_cta",
      "type": "cta_banner",
      "heading": "Come and swim with us",
      "body": "Book a £20 taster at a pool near you.",
      "cta": { "label": "Book a £20 taster", "href": "/contact?type=taster" }
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;

-- Contact page ------------------------------------------------------------
insert into public.pages (slug, title, published, blocks)
values (
  'contact',
  'Contact SplashNSwim',
  true,
  '[
    {
      "id": "contact_intro",
      "type": "rich_text",
      "heading": "Get in touch",
      "content": "Have a question, or ready to book a £20 taster? Send us a message using the form below and we will come back to you quickly. You can also email us directly at info@splashnswim.net."
    },
    {
      "id": "contact_form",
      "type": "contact",
      "heading": "Send an enquiry",
      "address": "Eastwood, Benfleet and Ashingdon, south Essex",
      "email": "info@splashnswim.net",
      "showEnquiryForm": true
    }
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, published = excluded.published, blocks = excluded.blocks;
