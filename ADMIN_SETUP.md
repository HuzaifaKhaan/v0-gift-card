# Admin Setup Instructions

## Creating the Admin User

To access the admin dashboard at `/admin/login`, you need to create an admin user in Supabase.

### Option 1: Run SQL Script (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the script: `scripts/004-create-admin-user.sql`
4. This will create an admin user with:
   - **Email:** admin@lastminutecards.com
   - **Password:** Admin123@

### Option 2: Use Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter:
   - Email: admin@lastminutecards.com
   - Password: Admin123@
   - Check "Auto Confirm User"
5. Click **Create User**

### Option 3: Sign Up via UI

1. Temporarily enable email signup in your Supabase Dashboard
2. Visit your app's signup page (if you have one)
3. Register with email: admin@lastminutecards.com
4. Disable public signup again for security

## Login

Once the user is created:
1. Visit `/admin/login`
2. Enter credentials:
   - Email: admin@lastminutecards.com
   - Password: Admin123@
3. You should be redirected to the admin dashboard

## Security Notes

- Change the default password immediately after first login
- Consider adding additional authentication layers (2FA, IP whitelist, etc.)
- The admin authentication currently checks if ANY user is logged in
- For production, consider adding a `role` column to differentiate admin vs regular users

## Troubleshooting

If you can't log in:
1. Check that the user exists in Supabase Auth dashboard
2. Verify email is confirmed
3. Check browser console for errors
4. Ensure environment variables are set correctly
