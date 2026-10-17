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

## Supabase setup (one time)

1. Create a project (region **West EU (London)** is closest to Nigeria).
2. Generate a personal access token: Account → Access Tokens.
3. Run:

   ```bash
   npx tsx scripts/generate-seed.ts          # refresh supabase/seed.sql from the sample listings
   SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... \
   SITE_URL=https://valueconnect.com.ng ADMIN_EMAILS=you@example.com \
   node scripts/setup-supabase.mjs
   ```

   This applies the migrations, seeds the sample listings, registers admin emails, disables public sign-ups and prints the env vars for Vercel.
4. Create each admin's login in the Supabase dashboard: **Authentication → Users → Add user** (use the same email as in `ADMIN_EMAILS`, tick *Auto confirm*). They set their own password, and can use **Forgot password** on `/admin/login` later.

## Deploying to Vercel

Env vars (Production and Preview):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (or legacy anon) key |
| `NEXT_PUBLIC_SITE_URL` | `https://valueconnect.com.ng` |
| `RESEND_API_KEY` | Optional, enables email alerts |
| `EMAIL_FROM` | Optional, e.g. `Valueconnect <no-reply@valueconnect.com.ng>` (domain must be verified in Resend) |
| `ADMIN_NOTIFY_EMAIL` | Optional, defaults to `info@valueconnect.com.ng` |

With the Vercel CLI and a token:

```bash
npx vercel link --yes --project valueconnect --token "$VERCEL_TOKEN"
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --token "$VERCEL_TOKEN"
# …repeat for the other variables (and for "preview")
npx vercel deploy --prod --token "$VERCEL_TOKEN"
npx vercel domains add valueconnect.com.ng --token "$VERCEL_TOKEN"
```

Then add the DNS records Vercel shows (an `A` record for the apex and a `CNAME` for `www`) at the domain registrar.

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
