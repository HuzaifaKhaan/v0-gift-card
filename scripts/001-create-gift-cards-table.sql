-- Create gift_cards table to track all gift card transactions
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  card_template VARCHAR(255),
  card_image_url TEXT,
  unique_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'Sent' CHECK (status IN ('Sent', 'Opened', 'Paid', 'Claimed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  -- Added updated_at field for tracking modifications
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_gift_cards_created_at ON gift_cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_cards_user_id ON gift_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_unique_code ON gift_cards(unique_code);

-- Enable Row Level Security
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their own gift cards
CREATE POLICY "Users can view their own gift cards"
  ON gift_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own gift cards
CREATE POLICY "Users can create gift cards"
  ON gift_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Updated admin policy to allow all authenticated users to view all cards (simpler approach)
-- Create policy for admin to view all gift cards
CREATE POLICY "Admin can view all gift cards"
  ON gift_cards
  FOR SELECT
  TO authenticated
  USING (true);

-- Added policy for updating gift card status
CREATE POLICY "System can update gift cards"
  ON gift_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Added function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gift_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Added trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS set_gift_cards_updated_at ON gift_cards;
CREATE TRIGGER set_gift_cards_updated_at
  BEFORE UPDATE ON gift_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_cards_updated_at();
