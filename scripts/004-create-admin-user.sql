-- Create admin user in Supabase Auth
-- This script should be run manually in Supabase SQL Editor or via Supabase CLI
-- The password will be hashed automatically by Supabase Auth

-- First, check if user exists
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Try to find existing user
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'admin@lastminutecards.com';
  
  -- If user doesn't exist, create one
  IF user_id IS NULL THEN
    -- Insert into auth.users (Supabase will handle password hashing)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
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
      crypt('Admin123@', gen_salt('bf')), -- Password: Admin123@
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"],"is_admin":true}'::jsonb,
      '{"full_name":"Admin User"}'::jsonb,
      false,
      '',
      '',
      '',
      ''
    );
    
    RAISE NOTICE 'Admin user created successfully with email: admin@lastminutecards.com';
  ELSE
    RAISE NOTICE 'Admin user already exists with email: admin@lastminutecards.com';
  END IF;
END $$;
