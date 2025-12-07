-- Create tables for storing region, city, and neighborhood data
-- These tables optimize locality lookups and avoid extracting from properties table

CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, region_id)
);

CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, city_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cities_region_id ON cities(region_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);

-- Enable RLS (Row Level Security)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to regions"
  ON regions FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to neighborhoods"
  ON neighborhoods FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete (for admin functionality)
CREATE POLICY "Allow authenticated users to manage regions"
  ON regions FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage cities"
  ON cities FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage neighborhoods"
  ON neighborhoods FOR ALL
  USING (auth.role() = 'authenticated');
