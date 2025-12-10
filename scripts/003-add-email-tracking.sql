-- Add email tracking columns to gift_cards table
ALTER TABLE gift_cards
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_id TEXT,
ADD COLUMN IF NOT EXISTS email_error TEXT;

-- Add index for email tracking queries
CREATE INDEX IF NOT EXISTS idx_gift_cards_email_sent ON gift_cards(email_sent);

-- Add comment
COMMENT ON COLUMN gift_cards.email_sent IS 'Whether the email was successfully sent to recipient';
COMMENT ON COLUMN gift_cards.email_id IS 'Resend email ID for tracking delivery';
COMMENT ON COLUMN gift_cards.email_error IS 'Error message if email sending failed';
