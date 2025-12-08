-- Add fields for tracking Stripe payment and payout information
ALTER TABLE gift_cards
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_payout_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS recipient_bank_account VARCHAR(255),
ADD COLUMN IF NOT EXISTS payout_status VARCHAR(50) DEFAULT 'Pending' CHECK (payout_status IN ('Pending', 'Processing', 'Completed', 'Failed'));

-- Create index for faster queries on Stripe IDs
CREATE INDEX IF NOT EXISTS idx_gift_cards_payment_intent ON gift_cards(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_payout_status ON gift_cards(payout_status);
