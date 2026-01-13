-- Add bank_name column to gift_cards table
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255);

-- Add comment to column
COMMENT ON COLUMN gift_cards.bank_name IS 'Name of the bank where the account is held';
