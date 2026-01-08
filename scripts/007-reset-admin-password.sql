-- Reset admin user password
-- This script will update the admin user's password to: Admin123@

-- First, delete the existing admin user if it exists
DELETE FROM auth.users WHERE email = 'admin@lastminutecards.com';

-- Create a new admin user with the correct password
-- The password 'Admin123@' will be hashed by Supabase Auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@lastminutecards.com',
  crypt('Admin123@', gen_salt('bf')),
  NOW(),
  '{"role": "admin"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Verify the admin user was created
SELECT id, email, raw_user_meta_data->>'role' as role, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@lastminutecards.com';
