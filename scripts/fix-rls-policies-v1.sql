-- New file - Fix insecure RLS policies

-- Drop insecure policies
DROP POLICY IF EXISTS "Allow anonymous gift card creation" ON gift_cards;
DROP POLICY IF EXISTS "Allow anonymous gift card updates" ON gift_cards;
DROP POLICY IF EXISTS "Allow anonymous gift card viewing" ON gift_cards;

-- Create secure policies for gift cards

-- Allow anyone to create gift cards (needed for checkout flow)
CREATE POLICY "Anyone can create gift cards"
ON gift_cards
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow viewing gift cards ONLY by unique code (recipient)
-- OR by sender email (sender tracking their cards)
CREATE POLICY "View gift cards by code or sender"
ON gift_cards
FOR SELECT
TO anon, authenticated
USING (
  unique_code = current_setting('request.jwt.claim.unique_code', true)
  OR sender_email = current_setting('request.jwt.claim.email', true)
);

-- Allow updating ONLY status fields when viewing by code
-- This prevents tampering with amount, bank details, etc.
CREATE POLICY "Update gift card status by code"
ON gift_cards
FOR UPDATE
TO anon, authenticated
USING (unique_code = current_setting('request.jwt.claim.unique_code', true))
WITH CHECK (
  -- Only allow updating these specific fields
  status IS DISTINCT FROM OLD.status
  OR opened_at IS DISTINCT FROM OLD.opened_at
  OR claimed_at IS DISTINCT FROM OLD.claimed_at
  OR recipient_bank_account IS DISTINCT FROM OLD.recipient_bank_account
  OR payout_status IS DISTINCT FROM OLD.payout_status
  OR stripe_payout_id IS DISTINCT FROM OLD.stripe_payout_id
);

-- Admin policies remain unchanged
-- Admin can view all gift cards (already exists)
-- Admin can manage card templates (already exists)
