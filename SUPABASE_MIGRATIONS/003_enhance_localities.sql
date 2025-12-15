-- 003_enhance_localities.sql
-- Enhance regions/cities/neighborhoods tables: add slug, description, lat/lng, updated_at, unique constraints and triggers

-- 1) Add columns if missing
alter table if exists public.regions
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists updated_at timestamptz default now();

alter table if exists public.cities
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists updated_at timestamptz default now();

alter table if exists public.neighborhoods
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists updated_at timestamptz default now();

-- 2) Add uniqueness constraints/indexes
create unique index if not exists regions_name_idx on public.regions (lower(name));
create unique index if not exists regions_slug_idx on public.regions (slug);

create unique index if not exists cities_region_name_idx on public.cities (region_id, lower(name));
create unique index if not exists cities_slug_idx on public.cities (slug);

create unique index if not exists neighbourhoods_city_name_idx on public.neighborhoods (city_id, lower(name));
create unique index if not exists neighbourhoods_slug_idx on public.neighborhoods (slug);

-- 3) Trigger function: set slug and updated_at
create or replace function public.set_locality_slug_and_timestamp()
returns trigger language plpgsql as $$
begin
  if (new.name is not null) then
    if (new.slug is null or length(trim(new.slug)) = 0) then
      -- simple slug: lowercase, replace non-alphanum with '-', collapse duplicates
      new.slug := regexp_replace(lower(new.name), '[^a-z0-9]+', '-', 'g');
      new.slug := regexp_replace(new.slug, '(^-|-$)', '', 'g');
    end if;
  end if;
  new.updated_at = now();
  return new;
exception when others then
  -- be resilient — don't abort DML on unexpected slug errors
  new.updated_at = now();
  return new;
end;
$$;

-- 4) Attach triggers to each table
drop trigger if exists set_locality_slug_and_timestamp_on_regions on public.regions;
create trigger set_locality_slug_and_timestamp_on_regions
before insert or update on public.regions
for each row execute procedure public.set_locality_slug_and_timestamp();

drop trigger if exists set_locality_slug_and_timestamp_on_cities on public.cities;
create trigger set_locality_slug_and_timestamp_on_cities
before insert or update on public.cities
for each row execute procedure public.set_locality_slug_and_timestamp();

drop trigger if exists set_locality_slug_and_timestamp_on_neighborhoods on public.neighborhoods;
create trigger set_locality_slug_and_timestamp_on_neighborhoods
before insert or update on public.neighborhoods
for each row execute procedure public.set_locality_slug_and_timestamp();

-- 5) Optional seed sample data (idempotent)
insert into public.regions (name, slug, description)
values
  ('Littoral', 'littoral', 'Région côtière contenant la plus grande ville Douala'),
  ('Centre', 'centre', 'Région centrale')
on conflict (lower(name)) do nothing;

insert into public.cities (region_id, name, slug)
select r.id, 'Douala', 'douala' from public.regions r where lower(r.name) = 'littoral'
on conflict (region_id, lower(name)) do nothing;

insert into public.cities (region_id, name, slug)
select r.id, 'Yaoundé', 'yaounde' from public.regions r where lower(r.name) = 'centre'
on conflict (region_id, lower(name)) do nothing;

insert into public.neighborhoods (city_id, name, slug)
select c.id, 'Akwa', 'akwa' from public.cities c where lower(c.name) = 'douala'
on conflict (city_id, lower(name)) do nothing;

insert into public.neighborhoods (city_id, name, slug)
select c.id, 'Bastos', 'bastos' from public.cities c where lower(c.name) = 'yaounde'
on conflict (city_id, lower(name)) do nothing;
