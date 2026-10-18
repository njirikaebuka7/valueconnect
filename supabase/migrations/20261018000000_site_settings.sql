-- Contact details and social links shown across the site, edited in
-- Admin → Settings. A single row (id = 1); safe to run more than once.
-- The first address, phone and email in each list is the main one.

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  addresses text[] not null default '{}',
  phones text[] not null default '{}',
  emails text[] not null default '{}',
  whatsapp text,
  facebook text,
  instagram text,
  x text,
  linkedin text,
  youtube text,
  tiktok text,
  updated_at timestamptz not null default now()
);

-- The first version had one address, two phones and one email in their own
-- columns: fold those into the lists.
alter table public.site_settings
  add column if not exists addresses text[] not null default '{}',
  add column if not exists phones text[] not null default '{}',
  add column if not exists emails text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings' and column_name = 'phone_1'
  ) then
    -- Only fill lists that are still empty, so this never overwrites an edit.
    update public.site_settings set
      addresses = case when addresses = '{}' then array_remove(array_remove(array[address], null), '') else addresses end,
      phones = case when phones = '{}' then array_remove(array_remove(array[phone_1, phone_2], null), '') else phones end,
      emails = case when emails = '{}' then array_remove(array_remove(array[email], null), '') else emails end;
    alter table public.site_settings
      drop column address,
      drop column phone_1,
      drop column phone_2,
      drop column email;
  end if;
end $$;

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

insert into public.site_settings (id, addresses, phones, emails, whatsapp)
values (
  1,
  array['17, Musa Yar''adua Street, Off Kofo Abayomi Street, Victoria Island, Lagos.'],
  array['0814 483 3999', '0811 090 0644'],
  array['info@valueconnect.com.ng'],
  '0814 483 3999'
)
on conflict (id) do nothing;
