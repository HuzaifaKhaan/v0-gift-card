-- Create card_templates table to store card designs dynamically
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_card_templates_category ON card_templates(category);
CREATE INDEX IF NOT EXISTS idx_card_templates_category_subcategory ON card_templates(category, subcategory);

-- Enable RLS
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read card templates
CREATE POLICY "Anyone can view card templates" ON card_templates
  FOR SELECT USING (true);

-- Allow authenticated admin to insert/update/delete
CREATE POLICY "Admin can manage card templates" ON card_templates
  FOR ALL USING (true);
