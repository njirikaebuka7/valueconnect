-- Contact details and social links shown across the site, edited in
-- Admin → Settings. A single row (id = 1); safe to run more than once.

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  address text not null,
  phone_1 text not null,
  phone_2 text,
  whatsapp text,
  email text not null,
  facebook text,
  instagram text,
  x text,
  linkedin text,
  youtube text,
  tiktok text,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;

-- Everyone can read them (they're printed on every page); only admins change them.
drop policy if exists "read site settings" on public.site_settings;
create policy "read site settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (id, address, phone_1, phone_2, whatsapp, email)
values (
  1,
  '17, Musa Yar''adua Street, Off Kofo Abayomi Street, Victoria Island, Lagos.',
  '0814 483 3999',
  '0811 090 0644',
  '0814 483 3999',
  'info@valueconnect.com.ng'
)
on conflict (id) do nothing;
