-- Fix RLS policy to allow anonymous users to create gift cards
-- This is needed because users don't need to sign up to send gift cards

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create gift cards" ON gift_cards;

-- Create a new policy that allows anyone to insert gift cards
CREATE POLICY "Anyone can create gift cards" ON gift_cards
  FOR INSERT
  WITH CHECK (true);

-- Also allow anyone to view gift cards by their unique_code (for recipients)
DROP POLICY IF EXISTS "Anyone can view gift cards by code" ON gift_cards;
CREATE POLICY "Anyone can view gift cards by code" ON gift_cards
  FOR SELECT
  USING (true);

-- Allow updates to gift cards (for claiming, etc.)
DROP POLICY IF EXISTS "Anyone can update gift cards" ON gift_cards;
CREATE POLICY "Anyone can update gift cards" ON gift_cards
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
