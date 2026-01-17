-- ============================================
-- BaliFinds Database Schema
-- All tables prefixed with bali_
-- ============================================

-- ============================================
-- USERS
-- ============================================
CREATE TABLE bali_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  preferred_currency TEXT DEFAULT 'IDR' CHECK (preferred_currency IN ('IDR', 'USD', 'EUR')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Username format validation (lowercase alphanumeric + underscore, 3-20 chars)
ALTER TABLE bali_users ADD CONSTRAINT bali_username_format
  CHECK (username ~ '^[a-z0-9_]{3,20}$');

-- ============================================
-- SHOPS
-- ============================================
CREATE TABLE bali_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES bali_users(id) ON DELETE SET NULL,

  -- Photo (required)
  photo_url TEXT NOT NULL,

  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_verified BOOLEAN DEFAULT false,

  -- Category
  category TEXT NOT NULL CHECK (category IN ('wood', 'ceramics', 'stone')),

  -- Stats (denormalized for performance)
  upvote_count INT DEFAULT 0,
  item_count INT DEFAULT 0,
  min_price_millions DECIMAL(10, 2),
  max_price_millions DECIMAL(10, 2),
  avg_price_millions DECIMAL(10, 2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bali_shops_category ON bali_shops(category);
CREATE INDEX idx_bali_shops_avg_price ON bali_shops(avg_price_millions);

-- ============================================
-- ITEMS
-- ============================================
CREATE TABLE bali_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES bali_shops(id) ON DELETE CASCADE,

  -- Photo (required)
  photo_url TEXT NOT NULL,

  -- Price in millions IDR (e.g., 5.5 = 5,500,000 IDR)
  price_millions DECIMAL(10, 2) NOT NULL CHECK (price_millions > 0),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bali_items_shop ON bali_items(shop_id);

-- ============================================
-- UPVOTES
-- ============================================
CREATE TABLE bali_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES bali_users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES bali_shops(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, shop_id)
);

CREATE INDEX idx_bali_upvotes_shop ON bali_upvotes(shop_id);
CREATE INDEX idx_bali_upvotes_user ON bali_upvotes(user_id);

-- ============================================
-- ANONYMOUS CONTRIBUTIONS
-- ============================================
CREATE TABLE bali_anonymous_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  shop_id UUID REFERENCES bali_shops(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update shop stats when items change
CREATE OR REPLACE FUNCTION bali_update_shop_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bali_shops SET
    item_count = (SELECT COUNT(*) FROM bali_items WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id)),
    min_price_millions = (SELECT MIN(price_millions) FROM bali_items WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id)),
    max_price_millions = (SELECT MAX(price_millions) FROM bali_items WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id)),
    avg_price_millions = (SELECT AVG(price_millions) FROM bali_items WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.shop_id, OLD.shop_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bali_update_shop_stats
AFTER INSERT OR UPDATE OR DELETE ON bali_items
FOR EACH ROW EXECUTE FUNCTION bali_update_shop_stats();

-- Function to update upvote count
CREATE OR REPLACE FUNCTION bali_update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bali_shops SET
    upvote_count = (SELECT COUNT(*) FROM bali_upvotes WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.shop_id, OLD.shop_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bali_update_upvote_count
AFTER INSERT OR DELETE ON bali_upvotes
FOR EACH ROW EXECUTE FUNCTION bali_update_upvote_count();

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================
-- Create bucket: bali-shop-photos
-- Settings: Public read, public write (no auth required)
-- Max file size: 5MB
-- Allowed types: image/jpeg, image/png, image/webp
