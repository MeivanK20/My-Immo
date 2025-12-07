-- Seed data for Cameroon regions, cities, and neighborhoods
-- This is sample data for the My Immo platform

-- Insert regions (Cameroon has 10 regions)
INSERT INTO regions (name) VALUES
  ('Adamawa'),
  ('Centre'),
  ('East'),
  ('Far North'),
  ('Littoral'),
  ('North'),
  ('Northwest'),
  ('South'),
  ('Southwest'),
  ('West')
ON CONFLICT (name) DO NOTHING;

-- Insert cities and neighborhoods for Centre region (main region with Yaoundé)
WITH centre_region AS (
  SELECT id FROM regions WHERE name = 'Centre'
)
INSERT INTO cities (name, region_id)
SELECT 'Yaoundé', id FROM centre_region
ON CONFLICT (name, region_id) DO NOTHING;

WITH yaounde_city AS (
  SELECT c.id FROM cities c
  JOIN regions r ON c.region_id = r.id
  WHERE c.name = 'Yaoundé' AND r.name = 'Centre'
)
INSERT INTO neighborhoods (name, city_id)
SELECT neighborhood, id FROM (
  VALUES
    ('Bastos'),
    ('Mvan'),
    ('Kondengui'),
    ('Biyem-Assi'),
    ('Nlongkak'),
    ('Obili'),
    ('Mokolo'),
    ('Nkomkana'),
    ('Bonamoussadi'),
    ('Etoudi'),
    ('Mimboman'),
    ('Santa Barbara'),
    ('Mont-Fébé'),
    ('Akwa'),
    ('Bananeraie')
) AS neighborhoods(neighborhood)
CROSS JOIN yaounde_city
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert cities and neighborhoods for Littoral region (Douala)
WITH littoral_region AS (
  SELECT id FROM regions WHERE name = 'Littoral'
)
INSERT INTO cities (name, region_id)
SELECT 'Douala', id FROM littoral_region
ON CONFLICT (name, region_id) DO NOTHING;

WITH douala_city AS (
  SELECT c.id FROM cities c
  JOIN regions r ON c.region_id = r.id
  WHERE c.name = 'Douala' AND r.name = 'Littoral'
)
INSERT INTO neighborhoods (name, city_id)
SELECT neighborhood, id FROM (
  VALUES
    ('Akwa'),
    ('Bonamoussadi'),
    ('Bepanda'),
    ('New Bell'),
    ('Deido'),
    ('Bonasama'),
    ('Yassa'),
    ('Kotto'),
    ('Japan'),
    ('Nkokomo'),
    ('Makepe'),
    ('Bè-Ibé'),
    ('Logbaba')
) AS neighborhoods(neighborhood)
CROSS JOIN douala_city
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert cities and neighborhoods for West region (Bafoussam)
WITH west_region AS (
  SELECT id FROM regions WHERE name = 'West'
)
INSERT INTO cities (name, region_id)
SELECT 'Bafoussam', id FROM west_region
ON CONFLICT (name, region_id) DO NOTHING;

WITH bafoussam_city AS (
  SELECT c.id FROM cities c
  JOIN regions r ON c.region_id = r.id
  WHERE c.name = 'Bafoussam' AND r.name = 'West'
)
INSERT INTO neighborhoods (name, city_id)
SELECT neighborhood, id FROM (
  VALUES
    ('Bafoussam Centre'),
    ('Bafoussam East'),
    ('Bafoussam West'),
    ('Bafoussam North'),
    ('Bangangté'),
    ('Dschang')
) AS neighborhoods(neighborhood)
CROSS JOIN bafoussam_city
ON CONFLICT (name, city_id) DO NOTHING;
