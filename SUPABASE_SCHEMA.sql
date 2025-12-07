-- SUPABASE DATABASE SCHEMA FOR MY IMMO
-- Exécutez ces commandes SQL dans votre dashboard Supabase (SQL Editor)

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  fullName TEXT NOT NULL,
  phone TEXT,
  profilePhoto TEXT,
  role TEXT NOT NULL CHECK (role IN ('visitor', 'agent', 'admin')) DEFAULT 'visitor',
  companyName TEXT,
  licenseNumber TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_auth FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- 2. PROPERTIES TABLE
-- ============================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agentId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  sqft INTEGER NOT NULL,
  imageUrl TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  tag TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Anyone can read properties"
  ON properties FOR SELECT
  USING (TRUE);

CREATE POLICY "Agents can create properties"
  ON properties FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (
    agentId = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (
    agentId = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- 3. MESSAGES TABLE
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversationId UUID NOT NULL,
  senderId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiverId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Enable RLS for messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  USING (
    senderId = auth.uid() OR receiverId = auth.uid()
  );

CREATE POLICY "Users can create messages"
  ON messages FOR INSERT
  WITH CHECK (senderId = auth.uid());

-- ============================================================
-- 4. CONVERSATIONS TABLE
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1Id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant2Id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1Id, participant2Id)
);

-- Enable RLS for conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can read their conversations"
  ON conversations FOR SELECT
  USING (
    participant1Id = auth.uid() OR participant2Id = auth.uid()
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    participant1Id = auth.uid() OR participant2Id = auth.uid()
  );

-- ============================================================
-- INDEXES (for better query performance)
-- ============================================================
CREATE INDEX idx_properties_agent_id ON properties(agentId);
CREATE INDEX idx_properties_region_city ON properties(region, city);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_messages_conversation_id ON messages(conversationId);
CREATE INDEX idx_messages_sender_id ON messages(senderId);
CREATE INDEX idx_conversations_participants ON conversations(participant1Id, participant2Id);

-- ============================================================
-- NOTES
-- ============================================================
-- 1. L'authentification est gérée par Supabase Auth (table auth.users)
-- 2. Les Row Level Security (RLS) protègent les données selon le rôle
-- 3. Les foreign keys assurent l'intégrité référentielle
-- 4. Les indexes améliorent la performance des requêtes
-- 5. Vous pouvez ajouter des colonnes supplémentaires selon vos besoins
