-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Localities schema (regions, cities, neighborhoods)

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

CREATE INDEX IF NOT EXISTS idx_cities_region_id ON cities(region_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Policies: public read
CREATE POLICY IF NOT EXISTS "Allow public read access to regions"
  ON regions FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to neighborhoods"
  ON neighborhoods FOR SELECT
  USING (true);

-- Policies: authenticated users can manage (example)
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage regions"
  ON regions FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage cities"
  ON cities FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage neighborhoods"
  ON neighborhoods FOR ALL
  USING (auth.role() = 'authenticated');

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT,
  region VARCHAR(255),
  city VARCHAR(255),
  neighborhood VARCHAR(255),
  property_type VARCHAR(100),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area INTEGER DEFAULT 0,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public can read properties
CREATE POLICY IF NOT EXISTS "Public can read properties"
  ON properties FOR SELECT
  USING (true);

-- Authenticated users can insert/update/delete their own properties
CREATE POLICY IF NOT EXISTS "Authenticated can insert properties"
  ON properties FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated can update their properties"
  ON properties FOR UPDATE
  USING (auth.role() = 'authenticated' AND (agent_id IS NULL OR agent_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Authenticated can delete their properties"
  ON properties FOR DELETE
  USING (auth.role() = 'authenticated' AND (agent_id IS NULL OR agent_id = auth.uid()));
