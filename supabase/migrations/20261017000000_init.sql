-- Valueconnect Consulting: initial schema
-- Public visitors never touch tables directly: they read published
-- properties and submit forms through the security-definer RPCs below.
-- Everything else is admin-only through row level security.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  email text primary key check (email = lower(email)),
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- VC-2610-4F7A2C style references; prefix differs per table.
create or replace function public.make_reference(prefix text)
returns text
language sql
volatile
as $$
  select prefix || '-' || to_char(now() at time zone 'Africa/Lagos', 'YYMM') || '-' ||
         upper(encode(extensions.gen_random_bytes(3), 'hex'));
$$;

-- ---------------------------------------------------------------------------
-- Properties
-- ---------------------------------------------------------------------------

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 160),
  listing_type text not null check (listing_type in ('sale', 'rent', 'shortlet', 'lease')),
  property_type text not null check (property_type in (
    'detached', 'semi-detached', 'terrace', 'duplex', 'apartment', 'penthouse',
    'bungalow', 'land', 'office', 'commercial', 'warehouse'
  )),
  status text not null default 'available' check (status in ('available', 'under_offer', 'sold', 'let')),
  price bigint not null default 0 check (price >= 0),
  price_period text check (price_period in ('year', 'month', 'night')),
  price_on_request boolean not null default false,
  state text not null,
  city text not null,
  area text not null default '',
  address text not null default '',
  bedrooms smallint check (bedrooms >= 0),
  bathrooms smallint check (bathrooms >= 0),
  toilets smallint check (toilets >= 0),
  parking smallint check (parking >= 0),
  size_sqm numeric(12, 2) check (size_sqm >= 0),
  title_document text,
  description text not null default '',
  features text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  verified boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_published_idx on public.properties (published, created_at desc);
create index if not exists properties_featured_idx on public.properties (featured) where featured;

drop trigger if exists properties_touch on public.properties;
create trigger properties_touch before update on public.properties
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Valuation requests
-- ---------------------------------------------------------------------------

create table if not exists public.valuation_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default public.make_reference('VC'),
  status text not null default 'new' check (status in (
    'new', 'reviewing', 'quoted', 'scheduled', 'in_progress', 'completed', 'cancelled'
  )),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 160),
  phone text not null check (char_length(phone) between 7 and 30),
  company text check (char_length(company) <= 160),
  client_type text check (char_length(client_type) <= 60),
  property_type text not null check (char_length(property_type) <= 60),
  purpose text not null check (char_length(purpose) <= 60),
  state text not null check (char_length(state) <= 60),
  city text check (char_length(city) <= 80),
  address text not null check (char_length(address) between 3 and 300),
  land_size text check (char_length(land_size) <= 80),
  building_details text check (char_length(building_details) <= 600),
  title_document text check (char_length(title_document) <= 80),
  property_id uuid references public.properties (id) on delete set null,
  preferred_date date,
  urgency text not null default 'standard' check (urgency in ('standard', 'express')),
  contact_method text check (char_length(contact_method) <= 30),
  notes text check (char_length(notes) <= 2000),
  quote_amount bigint check (quote_amount >= 0),
  inspection_date timestamptz,
  admin_response text,
  internal_notes text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists valuation_requests_status_idx on public.valuation_requests (status, created_at desc);

drop trigger if exists valuation_requests_touch on public.valuation_requests;
create trigger valuation_requests_touch before update on public.valuation_requests
  for each row execute function public.touch_updated_at();

create table if not exists public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.valuation_requests (id) on delete cascade,
  kind text not null check (kind in ('created', 'status', 'response', 'note')),
  status text,
  message text,
  visible_to_client boolean not null default false,
  actor text,
  created_at timestamptz not null default now()
);

create index if not exists request_events_request_idx on public.request_events (request_id, created_at);

-- ---------------------------------------------------------------------------
-- Consultations, inbox, newsletter
-- ---------------------------------------------------------------------------

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default public.make_reference('BK'),
  status text not null default 'new' check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 160),
  phone text not null check (char_length(phone) between 7 and 30),
  service text not null check (char_length(service) <= 80),
  mode text not null default 'in_person' check (mode in ('in_person', 'phone', 'video')),
  preferred_date date,
  preferred_time text check (char_length(preferred_time) <= 20),
  message text check (char_length(message) <= 2000),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists consultations_touch on public.consultations;
create trigger consultations_touch before update on public.consultations
  for each row execute function public.touch_updated_at();

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'contact' check (kind in ('contact', 'enquiry')),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 160),
  phone text check (char_length(phone) <= 30),
  subject text check (char_length(subject) <= 160),
  message text not null check (char_length(message) between 2 and 4000),
  property_id uuid references public.properties (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  email text primary key check (email = lower(email) and char_length(email) between 5 and 160),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.properties enable row level security;
alter table public.valuation_requests enable row level security;
alter table public.request_events enable row level security;
alter table public.consultations enable row level security;
alter table public.messages enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select to authenticated using (public.is_admin());

drop policy if exists "read published properties" on public.properties;
create policy "read published properties" on public.properties
  for select to anon, authenticated using (published or public.is_admin());

drop policy if exists "admins manage properties" on public.properties;
create policy "admins manage properties" on public.properties
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage valuation requests" on public.valuation_requests;
create policy "admins manage valuation requests" on public.valuation_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage request events" on public.request_events;
create policy "admins manage request events" on public.request_events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage consultations" on public.consultations;
create policy "admins manage consultations" on public.consultations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage messages" on public.messages;
create policy "admins manage messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage subscribers" on public.subscribers;
create policy "admins manage subscribers" on public.subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public RPCs (the only write path open to anonymous visitors)
-- ---------------------------------------------------------------------------

create or replace function public.submit_valuation_request(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.valuation_requests;
begin
  insert into public.valuation_requests (
    full_name, email, phone, company, client_type, property_type, purpose, state, city,
    address, land_size, building_details, title_document, property_id, preferred_date,
    urgency, contact_method, notes
  ) values (
    trim(payload ->> 'full_name'),
    lower(trim(payload ->> 'email')),
    trim(payload ->> 'phone'),
    nullif(trim(payload ->> 'company'), ''),
    nullif(trim(payload ->> 'client_type'), ''),
    trim(payload ->> 'property_type'),
    trim(payload ->> 'purpose'),
    trim(payload ->> 'state'),
    nullif(trim(payload ->> 'city'), ''),
    trim(payload ->> 'address'),
    nullif(trim(payload ->> 'land_size'), ''),
    nullif(trim(payload ->> 'building_details'), ''),
    nullif(trim(payload ->> 'title_document'), ''),
    (select p.id from public.properties p
      where p.id::text = payload ->> 'property_id' and p.published),
    nullif(payload ->> 'preferred_date', '')::date,
    coalesce(nullif(payload ->> 'urgency', ''), 'standard'),
    nullif(trim(payload ->> 'contact_method'), ''),
    nullif(trim(payload ->> 'notes'), '')
  )
  returning * into rec;

  insert into public.request_events (request_id, kind, status, message, visible_to_client, actor)
  values (rec.id, 'created', 'new', 'Valuation request received', true, 'client');

  return rec.reference;
end;
$$;

create or replace function public.track_valuation_request(p_reference text, p_email text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'reference', r.reference,
    'status', r.status,
    'full_name', split_part(r.full_name, ' ', 1),
    'property_type', r.property_type,
    'purpose', r.purpose,
    'address', r.address,
    'state', r.state,
    'urgency', r.urgency,
    'quote_amount', r.quote_amount,
    'inspection_date', r.inspection_date,
    'admin_response', r.admin_response,
    'responded_at', r.responded_at,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'kind', e.kind, 'status', e.status, 'message', e.message, 'created_at', e.created_at
      ) order by e.created_at)
      from public.request_events e
      where e.request_id = r.id and e.visible_to_client
    ), '[]'::jsonb)
  )
  from public.valuation_requests r
  where upper(r.reference) = upper(trim(p_reference))
    and r.email = lower(trim(p_email));
$$;

create or replace function public.submit_consultation(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ref text;
begin
  insert into public.consultations (
    full_name, email, phone, service, mode, preferred_date, preferred_time, message
  ) values (
    trim(payload ->> 'full_name'),
    lower(trim(payload ->> 'email')),
    trim(payload ->> 'phone'),
    trim(payload ->> 'service'),
    coalesce(nullif(payload ->> 'mode', ''), 'in_person'),
    nullif(payload ->> 'preferred_date', '')::date,
    nullif(trim(payload ->> 'preferred_time'), ''),
    nullif(trim(payload ->> 'message'), '')
  )
  returning reference into ref;
  return ref;
end;
$$;

create or replace function public.submit_message(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.messages (kind, full_name, email, phone, subject, message, property_id)
  values (
    case when payload ->> 'kind' = 'enquiry' then 'enquiry' else 'contact' end,
    trim(payload ->> 'full_name'),
    lower(trim(payload ->> 'email')),
    nullif(trim(payload ->> 'phone'), ''),
    nullif(trim(payload ->> 'subject'), ''),
    trim(payload ->> 'message'),
    (select p.id from public.properties p
      where p.id::text = payload ->> 'property_id' and p.published)
  );
end;
$$;

create or replace function public.subscribe_newsletter(p_email text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.subscribers (email) values (lower(trim(p_email)))
  on conflict (email) do nothing;
$$;

revoke all on function public.submit_valuation_request(jsonb) from public;
revoke all on function public.track_valuation_request(text, text) from public;
revoke all on function public.submit_consultation(jsonb) from public;
revoke all on function public.submit_message(jsonb) from public;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.submit_valuation_request(jsonb) to anon, authenticated;
grant execute on function public.track_valuation_request(text, text) to anon, authenticated;
grant execute on function public.submit_consultation(jsonb) to anon, authenticated;
grant execute on function public.submit_message(jsonb) to anon, authenticated;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: property photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

drop policy if exists "admins upload property images" on storage.objects;
create policy "admins upload property images" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "admins update property images" on storage.objects;
create policy "admins update property images" on storage.objects
  for update to authenticated using (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "admins delete property images" on storage.objects;
create policy "admins delete property images" on storage.objects
  for delete to authenticated using (bucket_id = 'property-images' and public.is_admin());
