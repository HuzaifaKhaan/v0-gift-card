-- Create card_templates table
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  recipient_email VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  card_template VARCHAR(255),
  card_image_url TEXT,
  unique_code VARCHAR(50) UNIQUE NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'Sent',
  claimed_at TIMESTAMP,
  claimed_by_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_card_templates_category ON card_templates(category);
CREATE INDEX IF NOT EXISTS idx_card_templates_subcategory ON card_templates(subcategory);
CREATE INDEX IF NOT EXISTS idx_gift_cards_unique_code ON gift_cards(unique_code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_invoice_number ON gift_cards(invoice_number);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_sender_email ON gift_cards(sender_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);

-- Insert sample card templates
INSERT INTO card_templates (name, image_url, category, subcategory) VALUES
  ('Happy Birthday Number 18', '/images/cards/birthday-18.png', 'birthdays', 'number-cards'),
  ('Happy Birthday Number 21', '/images/cards/birthday-21.png', 'birthdays', 'number-cards'),
  ('Happy Birthday Number 30', '/images/cards/birthday-30.png', 'birthdays', 'number-cards'),
  ('Funny Birthday Card', '/images/cards/birthday-funny.png', 'birthdays', 'funny-cards'),
  ('Birthday Photo Card', '/images/cards/birthday-photo.png', 'birthdays', 'photo-cards'),
  ('Congratulations Card', '/images/cards/congratulations.png', 'well-wishes', 'congratulations'),
  ('Good Luck Card', '/images/cards/good-luck.png', 'well-wishes', 'good-luck'),
  ('Christmas Card', '/images/cards/christmas.png', 'seasonal', 'christmas'),
  ('Valentine Card', '/images/cards/valentine.png', 'seasonal', 'valentines'),
  ('New Baby Card', '/images/cards/new-baby.png', 'well-wishes', 'new-baby'),
  ('Anniversary Card', '/images/cards/anniversary.png', 'love-relationships', 'anniversary'),
  ('Wedding Card', '/images/cards/wedding.png', 'love-relationships', 'wedding')
ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security) on tables
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for card_templates (public read)
CREATE POLICY "card_templates_public_read" ON card_templates
  FOR SELECT USING (true);

-- Create policies for gift_cards (authenticated users can view their own)
CREATE POLICY "gift_cards_authenticated_insert" ON gift_cards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "gift_cards_authenticated_select" ON gift_cards
  FOR SELECT USING (
    auth.role() = 'authenticated' OR
    sender_email = auth.jwt() ->> 'email' OR
    recipient_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "gift_cards_authenticated_update" ON gift_cards
  FOR UPDATE USING (
    auth.role() = 'authenticated'
  );

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only be managed by admins
CREATE POLICY "admin_users_admin_only" ON admin_users
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
    )
  );

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255),
  action VARCHAR(255),
  table_name VARCHAR(100),
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_only" ON audit_logs
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
    )
  );
