# Quick Start Setup Guide

## 3 Simple Steps to Get Started

### Step 1: Create Database Tables (5 minutes)

Copy and paste this SQL into Supabase SQL Editor:
- Go to: https://app.supabase.com → Your Project → SQL Editor
- New Query → Paste contents of `/scripts/init-tables.sql`
- Click Run

**Tables created:**
- ✓ card_templates
- ✓ gift_cards  
- ✓ admin_users

---

### Step 2: Create Admin User (2 minutes)

**Option A: Fastest Method - Supabase Dashboard**

1. Go to: Authentication → Users → Create user
2. Email: `admin@lastminutecards.com`
3. Password: `LastMinute@Admin2024`
4. Click "User metadata" and paste:
```json
{
  "role": "admin",
  "full_name": "Administrator"
}
```
5. Click "Create user"

**Option B: Using Script**
```bash
npx ts-node scripts/create-admin.ts
```

---

### Step 3: Start Your App (1 minute)

```bash
npm install
npm run dev
```

Then visit:
- App: http://localhost:3000
- Admin: http://localhost:3000/admin/login

---

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@lastminutecards.com |
| Password | LastMinute@Admin2024 |

**⚠️ Change password immediately after first login!**

---

## That's It! 🎉

Your app is now ready to use. The database has:
- 6 pre-loaded card templates
- All necessary tables with indexes
- Row Level Security policies

---

## Next Steps

1. Log in to admin dashboard
2. Configure Stripe webhooks (in Admin Settings)
3. Set up email templates (in Admin Settings)  
4. Customize card designs (in Templates)
5. Test gift card creation flow

---

## Environment Variables

These should already be set in Vercel, but verify in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
RESEND_API_KEY=your_key
```

---

## Still Need Help?

- Database questions? → See `DATABASE_SETUP.md`
- Stripe setup? → See `STRIPE_PAYMENT_SETUP.md`  
- Issues? → Check the Troubleshooting sections in those docs
