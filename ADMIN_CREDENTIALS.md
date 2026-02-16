# Admin Credentials & Setup

## Immediate Setup Required

### Step 1: Run Database Migrations (5 min)

Execute the SQL migration in your Supabase dashboard:

1. Go to: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the contents of `scripts/init-tables.sql`
5. Click **Run**

### Step 2: Create Admin User (2 min)

**Easiest Method - Supabase Dashboard:**

1. Go to **Authentication** → **Users** → **Create user**
2. Email: `admin@lastminutecards.com`
3. Password: `LastMinute@Admin2024`
4. Click **User metadata** tab and paste:
```json
{
  "role": "admin",
  "full_name": "Administrator"
}
```
5. Click **Create user**

**Alternative - Using Script:**
```bash
npx ts-node scripts/create-admin.ts
```

---

## Admin Login Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@lastminutecards.com |
| **Password** | LastMinute@Admin2024 |
| **Login URL** | http://localhost:3000/admin/login |
| **Dashboard URL** | http://localhost:3000/admin |

---

## What You Can Do As Admin

- View all gift cards created
- View claim status and history
- View analytics and statistics
- Manage card templates
- Configure email notifications
- View payment transactions
- Export data reports

---

## First Login Checklist

1. ✓ Log in to `/admin/login`
2. ✓ Change your password (Settings page)
3. ✓ Configure email templates (Settings)
4. ✓ Set up Stripe webhook (Settings)
5. ✓ Customize card templates (Templates)
6. ✓ Set pricing for each template (Templates)
7. ✓ Test gift card creation flow

---

## Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key>
SUPABASE_SERVICE_ROLE_KEY=<your_key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_key>
STRIPE_SECRET_KEY=<your_key>
RESEND_API_KEY=<your_key>
```

---

## Database Tables Created

✓ **card_templates** - Gift card designs  
✓ **gift_cards** - Issued cards and claims  
✓ **admin_users** - Admin accounts  

All tables have indexes and Row Level Security enabled.

---

## Support

For detailed setup instructions, see: `DATABASE_SETUP.md`

For API documentation, see: `STRIPE_PAYMENT_SETUP.md`
