# Teacher invoice page

A hidden page on splashnswim.net where a teacher:

1. picks who they're invoicing: SplashNSwim or Sea Dragons Swim School
2. fills in their details, the days they worked (tap them on a calendar, then set hours and minutes), their hourly rate and bank details
3. previews the finished invoice
4. enters the team code and sends it

It arrives at info@splashnswim.net as a PDF, through the same Resend account as the contact form. Subject: `Invoice – {Name} – {Month Year} – {School}`. Replying goes straight to the teacher.

## Adding it to the site (about 10 minutes)

Nothing in the existing site changes. It's three new folders, one package and one config change.

1. Copy `app/teacher-invoice/`, `app/api/teacher-invoice/` and `lib/teacher-invoice/` into the repo. If the project uses `src/`, put all three under `src/`. The imports are relative, so they just need to stay in the same positions relative to each other.
2. `npm install @react-pdf/renderer`
3. Merge the keys in `next.config.snippet.ts` into `next.config` (Next 14 and 15 versions are both in the file).
4. Add `TEACHER_INVOICE_ACCESS_CODE` to `.env.local` and to the hosting dashboard (Vercel: Settings > Environment Variables), then redeploy.
5. Open `/teacher-invoice`, send a test invoice, and check it lands in info@splashnswim.net.
6. Share the link and the team code with teachers.

If the site's layout already shows the logo header on every page, delete the `<img ... logo-horizontal.png>` line near the top of `TeacherInvoiceForm.tsx` so it doesn't appear twice.

## Resend

- Uses `RESEND_API_KEY` from the contact form (the name is set in `lib/teacher-invoice/mail-config.ts` if the site uses a different one).
- Calls Resend's API directly, so it doesn't depend on the `resend` npm package or its version.
- Defaults: from `onboarding@resend.dev`, to `info@splashnswim.net`. Override with `TEACHER_INVOICE_FROM` / `TEACHER_INVOICE_TO`.
- Resend's test sender only delivers to the Resend account's own address, so teachers don't get a copy while it's in use; the page wording matches. Verify splashnswim.net in Resend and set `TEACHER_INVOICE_FROM` to an address on it, and the teacher copy switches on by itself.

## Privacy: no lingering data, no teacher sees another's

- Nothing is saved anywhere: no database, no cookies, no browser storage, nothing in the URL, nothing in server logs.
- The server returns no one's details. The only output is one email to the school.
- Each teacher's browser holds only what they type, and it's wiped:
  - as soon as the invoice is sent
  - when they press "Clear form"
  - after 15 minutes without activity (a device left unattended)
  - when they leave the page or come back to it with the Back button
- Browser autofill is off on every field, so details aren't saved to a shared phone or laptop.
- The NI number and bank details are only in the PDF attachment, not the email body.
- Teachers are never copied in while on Resend's test sender, so nothing goes to an address someone typed.
- Resend keeps its own log of sent emails; only people with access to the Resend account can see it.

## Keeping it hidden

- Not linked anywhere and marked `noindex, nofollow`.
- Sending needs the team code, checked on the server. Wrong codes are throttled (10 per 15 minutes per connection). Change the code any time by updating the environment variable and redeploying.
- To make the address harder to guess, rename the `app/teacher-invoice` folder (e.g. `app/team-invoices-x7k2`). Nothing else needs changing.
- Don't add it to `robots.txt`, which is public.

## Schools

Both schools live in `SCHOOLS` in `lib/teacher-invoice/schema.ts`: legal name, address, company number and reference prefix (SNS / SDS). Add one there and it appears on the page. SplashNSwim invoices carry the SplashNSwim wordmark; Sea Dragons invoices show the school name plainly.

## Pay

Time is entered in hours and minutes (5-minute steps). Total due = total minutes × hourly rate ÷ 60, rounded to the penny, so 20-minute lessons add up exactly. No VAT line.

## Branding

SplashNSwim Brand Guidelines v1.1: Deep Pool Blue on Warm White, Splash Blue primary button, Aqua and Axolotl Pink as accents, Fredoka headings and buttons, Nunito Sans body. Fonts are self-hosted in `lib/teacher-invoice/fonts/` (SIL Open Font Licence).
