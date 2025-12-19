-- Add columns to store bank account details for claimed gift cards
ALTER TABLE public.gift_cards
ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS sort_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS account_number_last4 VARCHAR(4);

-- Add comment to explain the columns
COMMENT ON COLUMN public.gift_cards.account_holder_name IS 'Name on the bank account for payout';
COMMENT ON COLUMN public.gift_cards.sort_code IS 'UK sort code for the bank account (format: 12-34-56)';
COMMENT ON COLUMN public.gift_cards.account_number_last4 IS 'Last 4 digits of account number for security';
