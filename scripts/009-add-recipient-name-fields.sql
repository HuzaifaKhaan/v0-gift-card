-- Add recipient first name and last name columns to gift_cards table
-- This migration adds separate name fields for the claim cash gift flow

ALTER TABLE gift_cards 
ADD COLUMN IF NOT EXISTS recipient_first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS recipient_last_name VARCHAR(255);
