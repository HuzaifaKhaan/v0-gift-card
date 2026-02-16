# Setup Verification Checklist

Use this checklist to verify your setup is complete.

## Pre-Setup Requirements

- [ ] You have access to Supabase project dashboard
- [ ] You have Supabase URL and API keys
- [ ] You have Stripe API keys configured
- [ ] You have Resend API key configured
- [ ] Node.js and npm/pnpm installed
- [ ] Git repository cloned and code updated

## Step 1: Database Tables

- [ ] Logged into Supabase dashboard
- [ ] Opened SQL Editor
- [ ] Copied contents of `scripts/init-tables.sql`
- [ ] Ran the SQL query successfully
- [ ] No errors in the output
- [ ] Can see these tables in your Supabase database:
  - [ ] card_templates (6 rows pre-populated)
  - [ ] gift_cards (empty)
  - [ ] admin_users (empty)

## Step 2: Admin User Creation

Choose one method:

### Method A: Dashboard
- [ ] Went to Authentication → Users
- [ ] Clicked "Create user"
- [ ] Entered email: admin@lastminutecards.com
- [ ] Entered password: LastMinute@Admin2024
- [ ] Added user metadata with role: "admin"
- [ ] User created successfully

### Method B: Script
- [ ] Ran: `npx ts-node scripts/create-admin.ts`
- [ ] Script completed without errors
- [ ] Saw credentials printed to console

### Verification
- [ ] Admin user appears in Supabase Authentication → Users
- [ ] User has email: admin@lastminutecards.com
- [ ] User metadata shows role: "admin"
- [ ] User is confirmed/verified

## Step 3: Start Application

- [ ] Ran: `npm install`
- [ ] Ran: `npm run dev`
- [ ] Application started without errors
- [ ] Dev server running on http://localhost:3000

## First Login Test

- [ ] Navigated to http://localhost:3000/admin/login
- [ ] Page loaded without errors
- [ ] No console errors in browser
- [ ] Form fields are visible and interactive

### Login Attempt
- [ ] Entered email: admin@lastminutecards.com
- [ ] Entered password: LastMinute@Admin2024
- [ ] Clicked Sign In button
- [ ] No 404 or connection errors
- [ ] Either logged in successfully OR got clear error message

### Troubleshooting Login Errors

If you see "Invalid credentials":
- [ ] Check admin user exists in Supabase Auth (not just database)
- [ ] Verify email matches exactly: admin@lastminutecards.com
- [ ] Verify password is exactly: LastMinute@Admin2024
- [ ] Check that user has role: "admin" in metadata
- [ ] Regenerate user if needed

If you see database errors:
- [ ] Verify all tables exist: card_templates, gift_cards, admin_users
- [ ] Check Row Level Security policies are created
- [ ] Verify environment variables are set correctly

## Application Pages

Once logged in, verify these pages load:

- [ ] Home page: http://localhost:3000
- [ ] Create page: http://localhost:3000/create
- [ ] Admin dashboard: http://localhost:3000/admin
- [ ] Admin login: http://localhost:3000/admin/login
- [ ] View card: http://localhost:3000/view/[code]
- [ ] Claim card: http://localhost:3000/claim

## Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- [ ] `STRIPE_SECRET_KEY` is set
- [ ] `RESEND_API_KEY` is set
- [ ] All vars are correct (no typos)
- [ ] App can connect to Supabase
- [ ] App can connect to Stripe

## Browser Console

- [ ] No red errors in console
- [ ] No unhandled promise rejections
- [ ] Network requests are successful (check Network tab)
- [ ] Images load properly
- [ ] CSS styling is applied correctly

## Supabase Verification

In Supabase dashboard:

- [ ] Tables exist: card_templates, gift_cards, admin_users
- [ ] card_templates has 6 rows (Birthday, Anniversary, etc.)
- [ ] Indexes are created
- [ ] RLS policies are enabled
- [ ] Authentication user exists for admin account

## Ready to Go! ✓

If you've checked all the boxes above, your setup is complete and the application is ready to use!

## Next Steps

1. Customize card templates in Admin → Templates
2. Configure Stripe webhooks in Admin → Settings
3. Set up email templates in Admin → Settings
4. Test creating a gift card
5. Test claiming a gift card
6. Deploy to production

## Still Having Issues?

1. Check the troubleshooting sections in DATABASE_SETUP.md
2. Review STRIPE_PAYMENT_SETUP.md for payment issues
3. Check Supabase logs for database errors
4. Check Stripe dashboard for webhook issues
5. Review browser console for client-side errors
6. Check server logs: `npm run dev` output
