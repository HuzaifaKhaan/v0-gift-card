-- Add full account number column to gift_cards table
ALTER TABLE gift_cards 
ADD COLUMN IF NOT EXISTS account_number character varying(8);

-- Add comment explaining the column
COMMENT ON COLUMN gift_cards.account_number IS 'Full UK bank account number (8 digits) - stored for admin manual transfer processing';
