-- Seed data for regions, cities, neighborhoods

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

-- Centre -> Yaoundé
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
    ('Mokolo')
) AS neighborhoods(neighborhood)
CROSS JOIN yaounde_city
ON CONFLICT (name, city_id) DO NOTHING;

-- Littoral -> Douala
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
    ('Deido')
) AS neighborhoods(neighborhood)
CROSS JOIN douala_city
ON CONFLICT (name, city_id) DO NOTHING;
