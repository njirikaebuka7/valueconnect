# Valueconnect Consulting

Website and admin platform for Valueconnect Consulting, Estate Surveyors & Valuers (Victoria Island, Lagos).

- **Public site:** home, about, services (one page per service), property listings with filters and saved homes, valuation requests (multi-step), request tracking, consultation booking, contact. Installable as an app on phones (PWA).
- **Admin (`/admin`):** dashboard, valuation requests (status, fee quote, inspection date, reply to client, internal notes, timeline), property manager with photo uploads, consultations, inbox, newsletter subscribers.
- **Stack:** Next.js 16 (App Router, Server Actions), Tailwind CSS 4, Supabase (Postgres, Auth, Storage), deployed on Vercel. Optional email alerts through Resend.

## How data flows

| What | Where it lives | Who can touch it |
| --- | --- | --- |
| Properties | `public.properties` | Anyone reads published rows; admins write |
| Valuation requests + timeline | `valuation_requests`, `request_events` | Visitors submit via `submit_valuation_request()`; clients read their own via `track_valuation_request(reference, email)`; admins manage |
| Consultations, messages, subscribers | `consultations`, `messages`, `subscribers` | Visitors submit via RPCs; admins manage |
| Property photos | Storage bucket `property-images` (public) | Admins upload |
| Admin accounts | Supabase Auth users whose email is in `public.admins` | Owner adds them |

Row level security is on for every table. Public visitors never write to tables directly, only through the security-definer RPCs in `supabase/migrations`.

Until the Supabase env vars are set, the site runs in **preview mode**: it shows the sample listings in `src/lib/seed/properties.ts`, forms show their success screens without storing anything, and `/admin` shows setup steps.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values
npm run dev
```

## Going live (one command)

Non-secret settings (Supabase project, admin emails, domains) are in `deploy.config.json`. The only secrets are two tokens, read from the environment:

| Variable | Where to create it |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | supabase.com → avatar → Access Tokens |
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |

```bash
npm run go-live -- --dry-run   # shows what will happen
npm run go-live                # does it
```

This:
1. Applies `supabase/migrations`, seeds the sample listings (only into an empty table), registers the admin emails, disables public sign-ups and sets the auth redirect URLs.
2. Creates or updates the Vercel project, sets `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL`, deploys to production, links the GitHub repo for auto-deploys when the Vercel GitHub app allows it, and adds the domains.
3. Prints the DNS records to add at the registrar: an `A` record `@ → 76.76.21.21` and a `CNAME` `www → cname.vercel-dns.com`.

Optional email alerts: also set `RESEND_API_KEY` (plus `EMAIL_FROM` and `ADMIN_NOTIFY_EMAIL`) before running it.

**Admin login:** create each admin's account in the Supabase dashboard (Authentication → Users → Add user → Create new user, tick *Auto Confirm*), using an email listed in `deploy.config.json`. Then sign in at `/admin/login`.

Run only the database part with `npm run setup:supabase`.

## Project map

```
src/app/(site)/        public pages
src/app/admin/         admin login + panel
src/app/actions/       Server Actions (public forms, admin)
src/components/        UI, layout, property, valuation, admin components
src/lib/content.ts     service copy, FAQs, process steps
src/lib/site.ts        company details, phone numbers, socials
src/lib/seed/          sample listings
supabase/migrations/   database schema, RLS and RPCs
scripts/               Supabase setup and seed generation
```

## Things to confirm before launch

- Which phone line is on WhatsApp (`site.whatsapp` in `src/lib/site.ts`).
- Social media links (`site.socials`). Empty links are hidden.
- Replace the sample listings and stock photos with real ones from the admin.
- Auctioneering: the Lagos State Auction Law requires an auctioneer's licence; confirm before promoting the service.
- Financial-reporting valuations: confirm FRC registration status before making IFRS claims.
