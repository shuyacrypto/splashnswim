-- ==========================================================================
-- Real content for Draupnir Capital. Run this after setup.sql. It is safe
-- to run more than once (existing rows are kept).
-- ==========================================================================

insert into public.site_settings (id, business_name, contact_email, contact_phone, booking_enabled)
values (
  true,
  'Draupnir Capital',
  'boris@draupnir.capital',
  null,
  false
)
on conflict (id) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'home',
  'Draupnir Capital | Gateway to Private Credit',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "eyebrow": "Institutional Private Credit for Web3",
      "heading": "Gateway to Private Credit",
      "subheading": "Connecting non-dilutive credit to the businesses building the next financial system.",
      "primaryCta": { "label": "Let'\''s talk", "href": "/contact" },
      "secondaryCta": { "label": "What we do", "href": "/what-we-do" }
    },
    {
      "id": "blk_positioning",
      "type": "rich_text",
      "heading": "The bridge between institutional credit and Web3",
      "content": "Draupnir Capital connects institutional private credit markets with the Web3 and DLT-driven businesses ready to meet them. We structure non-bank credit, asset-backed facilities and DLT-enhanced deals, then put founders directly in front of the lenders who fund them.\n\nPrivate credit has grown into a $3.5 trillion asset class. Most fintech and Web3 businesses do not know they qualify for it. Most placement agents cannot speak both languages. We can."
    },
    {
      "id": "blk_market",
      "type": "stats",
      "heading": "Private credit has already reached its largest size on record",
      "items": [
        { "value": "$0.5T", "label": "2016" },
        { "value": "$0.8T", "label": "2018" },
        { "value": "$1.0T", "label": "2020" },
        { "value": "$1.6T", "label": "2022" },
        { "value": "$2.6T", "label": "2024" },
        { "value": "$3.5T", "label": "2026" }
      ]
    },
    {
      "id": "blk_why_now",
      "type": "feature_grid",
      "heading": "Why now",
      "numbered": false,
      "items": [
        { "icon": "trending-up", "title": "Institutional capital needs yield", "description": "Rate-sensitive allocators are actively looking for structured, senior-secured credit outside traditional markets." },
        { "icon": "handshake", "title": "Almost nobody bridges both", "description": "Traditional advisers do not understand Web3. Web3-native teams lack lender relationships." },
        { "icon": "globe", "title": "Web3 assets are investable now", "description": "Tokenised real-world assets and on-chain receivables have matured enough for institutional diligence." },
        { "icon": "shield", "title": "Draupnir sits in the middle", "description": "Structuring and introductions handled by people who speak both languages." }
      ]
    },
    {
      "id": "blk_stats",
      "type": "stats",
      "heading": "Numbers that hold up on a call",
      "items": [
        { "value": "$3.5Bn+", "label": "Term sheets mandated on", "description": "Total facility value structured and mandated on since inception." },
        { "value": "$500M+", "label": "Term sheet value obtained", "description": "Signed term sheets converted into active mandates with institutional lenders." },
        { "value": "12", "label": "Individual mandates to date", "description": "Distinct transactions, each engaged on directly by the Draupnir team." }
      ]
    },
    {
      "id": "blk_what_we_do",
      "type": "feature_grid",
      "heading": "Two things, done properly, for one purpose",
      "numbered": false,
      "items": [
        { "icon": "key", "title": "Capital Introduction", "description": "Direct introductions to the institutional lenders, private credit funds and alternative lenders who actually fund deals in this space, sourced from our own network." },
        { "icon": "landmark", "title": "Deal Structuring", "description": "We shape the right facility for your business and stage, then run point on terms, diligence and documentation so the process moves at institutional speed." }
      ]
    },
    {
      "id": "blk_cta",
      "type": "cta_banner",
      "heading": "Let'\''s talk",
      "body": "If this looks like a fit, the next step is a short call to talk through your facility and timeline.",
      "cta": { "label": "Get in touch", "href": "/contact" }
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'what-we-do',
  'What We Do | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "What We Do",
      "subheading": "Capital introduction and deal structuring for Web3 and DLT-driven businesses seeking institutional private credit."
    },
    {
      "id": "blk_how",
      "type": "feature_grid",
      "heading": "From first conversation to funded, in three moves",
      "numbered": true,
      "items": [
        { "icon": "landmark", "title": "Structure", "description": "We position your business to meet what institutional private credit investors actually look for. Asset eligibility, facility type and security package are defined before a single lender call." },
        { "icon": "key", "title": "Access", "description": "We introduce you directly to the right private credit funds and lenders for your specific facility, drawn from an active network across six regions." },
        { "icon": "check-circle", "title": "Execution", "description": "We manage the process end to end, from term sheet through to close, with one point of contact through legal structuring, KYC and first drawdown." }
      ]
    },
    {
      "id": "blk_deal_terms",
      "type": "stats",
      "heading": "Deal terms",
      "items": [
        { "value": "$10M+", "label": "Facility size", "description": "Structured from $10 million upward." },
        { "value": "ABF / ABS", "label": "Asset-backed", "description": "Secured through asset-based structures." },
        { "value": "~3 Months", "label": "Kick-off to term sheet", "description": "Based on prior mandates. An estimate, not a guaranteed timeline." }
      ]
    },
    {
      "id": "blk_facilities",
      "type": "feature_grid",
      "heading": "Facility types built around the deal, not a template",
      "numbered": false,
      "items": [
        { "title": "Invoice Financing" },
        { "title": "Supply-Chain Financing" },
        { "title": "Trade Financing" },
        { "title": "Receivables Financing" },
        { "title": "AR/AP Financing" },
        { "title": "Payments Financing" },
        { "title": "Equipment Financing" }
      ]
    },
    {
      "id": "blk_what_youll_need",
      "type": "feature_grid",
      "heading": "What you'\''ll need",
      "numbered": false,
      "items": [
        { "icon": "file-text", "title": "Legal Counsel", "description": "Transaction and security documentation, negotiated alongside our own legal workstream." },
        { "icon": "shield", "title": "KYC / Compliance", "description": "Standard verification and onboarding checks, run in parallel with lender due diligence." },
        { "icon": "landmark", "title": "Escrow / Account Services", "description": "Collection and control accounts to hold and route facility cash flows." },
        { "icon": "layers", "title": "Tax & Structuring Advice", "description": "Confirming the facility structure works cleanly for your entity and jurisdiction." },
        { "icon": "check-circle", "title": "Audit / Financial Reporting", "description": "Up-to-date financials and reporting lenders will expect to see through diligence." },
        { "icon": "key", "title": "Insurance", "description": "Cover appropriate to the asset class being financed, where applicable." }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'our-work',
  'Our Work | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "Our Work",
      "subheading": "A track record measured in mandates, not marketing."
    },
    {
      "id": "blk_stats_repeat",
      "type": "stats",
      "items": [
        { "value": "$3.5Bn+", "label": "Term sheets mandated on" },
        { "value": "$500M+", "label": "Term sheet value obtained" },
        { "value": "12", "label": "Individual mandates to date" }
      ]
    },
    {
      "id": "blk_case_study",
      "type": "rich_text",
      "heading": "BlackOpal · GemStone",
      "content": "In January 2026, Draupnir acted as Lead Advisor and Capital Introduction Partner on a $200 million three-year facility backing GemStone, BlackOpal'\''s institutional platform for tokenised Brazilian credit card receivables.\n\nBoris Redfern, Head of Capital Markets at Draupnir, said: \"By structurally mitigating credit risk, BlackOpal has created an investment-grade product that global allocators can scale into with confidence.\""
    },
    {
      "id": "blk_regions",
      "type": "feature_grid",
      "heading": "Six regions, one team that already knows the lenders in each",
      "numbered": false,
      "items": [
        { "title": "United Kingdom (HQ)", "description": "Home base, and where the network runs deepest." },
        { "title": "Europe (ex-Russia)", "description": "Live lender relationships across the continent." },
        { "title": "North America", "description": "Institutional credit and private fund relationships." },
        { "title": "Latin America", "description": "Structuring experience across the region'\''s credit markets." },
        { "title": "MENA", "description": "Active lender relationships across the Gulf and wider region." },
        { "title": "APAC", "description": "Reach into Asia-Pacific'\''s institutional lender base." }
      ]
    },
    {
      "id": "blk_partner",
      "type": "feature_grid",
      "heading": "Partnerships",
      "numbered": false,
      "items": [
        { "icon": "handshake", "title": "Ava Labs", "description": "Capital Formation Partner. Draupnir works alongside Ava Labs to connect Web3 businesses building on Avalanche with institutional private credit." }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'team',
  'Team | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "Team",
      "subheading": "The two people behind every mandate."
    },
    {
      "id": "blk_team",
      "type": "team",
      "members": [
        { "name": "Boris Redfern", "role": "Head of Capital Markets", "bio": "Over a decade in structured finance, with a deep network of non-bank lenders across Europe. Previously Head of Capital Markets at Kasu.", "photo": { "src": "/team/boris.jpg", "alt": "Boris Redfern" } },
        { "name": "Sebastian Cheek", "role": "Head of Operations & Investment", "bio": "Formerly Head of Investment at Faculty Group, where he led an active investment fund. Runs deal operations end to end at Draupnir.", "photo": { "src": "/team/sebastian.jpg", "alt": "Sebastian Cheek" } }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'contact',
  'Contact | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "Contact",
      "subheading": "Tell us about your facility and timeline."
    },
    {
      "id": "blk_contact",
      "type": "contact",
      "heading": "Get in touch",
      "showEnquiryForm": true
    },
    {
      "id": "blk_disclaimer",
      "type": "rich_text",
      "heading": "Regulatory notice",
      "content": "Draupnir Capital Ltd (Company No. 16530781) is not licensed or authorised to provide financial, investment, or tax advice. Nothing on this website constitutes an offer, solicitation, or recommendation regarding any security or investment strategy. Recipients should seek independent professional advice before making any investment decision."
    }
  ]'::jsonb
)
on conflict (slug) do nothing;
