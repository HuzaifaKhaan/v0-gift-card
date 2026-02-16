# Database Setup Guide - LastMinuteCards

## Overview
This guide will walk you through setting up the database tables and admin credentials for the LastMinuteCards application.

## Step 1: Create Database Tables

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to the **SQL Editor** section
3. Create a new query and paste the entire contents of `/scripts/init-tables.sql`
4. Click **Run** to execute the migration

This will create:
- **card_templates** - Available gift card designs
- **gift_cards** - Issued gift cards with claim status
- **admin_users** - Admin user accounts with password hashing
- Indexes and Row Level Security policies

## Step 2: Create Admin User via Supabase Auth

The admin user is created through Supabase's built-in authentication system.

### Option A: Using Node.js Script (Recommended)

```bash
# Set environment variables (or use .env.local)
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the script
npx ts-node scripts/create-admin.ts
```

This script will:
- Create the admin user in Supabase Auth with admin role
- Add a reference entry in the admin_users table
- Display the login credentials

### Option B: Manual Creation in Supabase Dashboard

1. Go to Authentication → Users in your Supabase dashboard
2. Click "Create User" and enter:
   - Email: `admin@lastminutecards.com`
   - Password: `LastMinute@Admin2024`
   - Confirm password
3. Under "User metadata" JSON, add:
```json
{
  "role": "admin",
  "full_name": "Administrator"
}
```
4. Click Create User

Then optionally add to admin_users table:
```sql
INSERT INTO admin_users (email, password_hash, full_name, is_active)
VALUES (
  'admin@lastminutecards.com',
  'managed_by_supabase_auth',
  'Administrator',
  true
);
```

## Admin Credentials

**Email:** admin@lastminutecards.com  
**Password:** LastMinute@Admin2024  
**Login URL:** `/admin/login`

⚠️ **IMPORTANT:** Change this password immediately after your first login!

## Step 3: Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/login`
3. Log in with the admin credentials above
4. You should see the admin dashboard

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Make sure you've run the SQL migration from Step 1. The tables must exist before you can insert data.

### Issue: "Invalid credentials" or "Invalid password"
**Solution:** Make sure the admin user was created in Supabase Auth (not just the SQL table). Check Authentication → Users in Supabase dashboard. Re-run the create-admin.ts script if needed.

### Issue: "Supabase connection failed"
**Solution:** Check that your environment variables are correctly set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Database Schema

### card_templates
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Template name (e.g., "Birthday Celebration")
- `description` (TEXT) - Description
- `category` (VARCHAR) - Category (birthday, anniversary, etc.)
- `image_url` (VARCHAR) - URL to template image
- `background_color` (VARCHAR) - Hex color code
- `text_color` (VARCHAR) - Hex color code
- `is_active` (BOOLEAN) - Whether template is available
- `price_cents` (INTEGER) - Price in cents
- `created_at`, `updated_at` - Timestamps

### gift_cards
- `id` (UUID) - Primary key
- `template_id` (UUID) - Reference to card template
- `recipient_email` (VARCHAR) - Who receives the card
- `sender_name` (VARCHAR) - Who sent it
- `sender_email` (VARCHAR) - Sender's email
- `message` (TEXT) - Custom message
- `amount_cents` (INTEGER) - Gift card value
- `code` (VARCHAR) - Unique claim code
- `is_claimed` (BOOLEAN) - Claim status
- `claimed_at` (TIMESTAMP) - When it was claimed
- `claimed_by_email` (VARCHAR) - Email of who claimed it
- `stripe_payment_id` (VARCHAR) - Stripe transaction ID
- `created_at`, `updated_at` - Timestamps

### admin_users
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Admin email (unique)
- `password_hash` (VARCHAR) - Bcrypt hashed password
- `full_name` (VARCHAR) - Admin name
- `is_active` (BOOLEAN) - Account status
- `last_login` (TIMESTAMP) - Last login time
- `created_at`, `updated_at` - Timestamps

## Next Steps

1. Configure Stripe webhook for payment notifications
2. Set up email templates in Resend
3. Customize card templates in the admin panel
4. Test the gift card creation flow

For more information, see the main README.md file.
