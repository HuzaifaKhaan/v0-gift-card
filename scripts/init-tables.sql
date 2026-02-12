-- Create card_templates table
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  background_color VARCHAR(7) DEFAULT '#FFFFFF',
  text_color VARCHAR(7) DEFAULT '#000000',
  is_active BOOLEAN DEFAULT true,
  price_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES card_templates(id),
  recipient_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  message TEXT,
  amount_cents INTEGER DEFAULT 0,
  code VARCHAR(64) UNIQUE NOT NULL,
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  claimed_by_email VARCHAR(255),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table (for reference/audit, passwords managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- "managed_by_supabase_auth" or bcrypt hash
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_is_claimed ON gift_cards(is_claimed);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_card_templates_is_active ON card_templates(is_active);

-- Enable Row Level Security
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for card_templates (public read)
CREATE POLICY "Allow public read" ON card_templates
  FOR SELECT
  USING (is_active = true);

-- Create RLS policies for gift_cards (restrict access)
CREATE POLICY "Allow users to view their own cards" ON gift_cards
  FOR SELECT
  USING (
    recipient_email = auth.jwt() ->> 'email' OR
    sender_email = auth.jwt() ->> 'email' OR
    (SELECT is_active FROM admin_users WHERE email = auth.jwt() ->> 'email' LIMIT 1) = true
  );

-- Insert default card templates
INSERT INTO card_templates (name, description, category, background_color, text_color, is_active)
VALUES 
  ('Birthday Celebration', 'Colorful birthday card design', 'birthday', '#FFE5E0', '#F6664C', true),
  ('Anniversary Special', 'Elegant anniversary card', 'anniversary', '#F5F5F5', '#185F72', true),
  ('Congratulations', 'Success and achievement card', 'congratulations', '#FFF7E6', '#FF9500', true),
  ('Thank You', 'Gratitude and appreciation card', 'thank-you', '#F0F8FF', '#4169E1', true),
  ('Get Well', 'Recovery and healing wishes card', 'get-well', '#F0FFF0', '#228B22', true),
  ('New Baby', 'Baby arrival celebration card', 'new-baby', '#FFE4F0', '#FF69B4', true)
ON CONFLICT DO NOTHING;
