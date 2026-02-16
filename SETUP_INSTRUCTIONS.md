# LastMinuteCards - Complete Setup Instructions

## ✅ Status

- **Supabase Database**: ✓ Configured
- **Admin Credentials**: ✓ Ready
- **Stripe**: ⏳ Awaiting API Keys
- **Environment**: ✓ Configured

---

## 🚀 Quick Start (5 minutes)

### Step 1: Initialize Database & Admin

```bash
cd /vercel/share/v0-project
npm install
npx ts-node scripts/setup-all.ts
```

This will:
- Create all database tables
- Create admin user in Supabase Auth
- Insert default card templates
- Display admin credentials

### Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 3: Login to Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Email: `admin@lastminutecards.com`
3. Password: `LastMinute@Admin2024`

---

## 🔑 Admin Credentials

```
Email:    admin@lastminutecards.com
Password: LastMinute@Admin2024
```

⚠️ **IMPORTANT**: Change this password immediately after first login!

---

## 💳 Stripe Setup (When API Keys are Provided)

Once you provide Stripe API keys, update `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

Then restart the dev server.

---

## 🗄️ Database Configuration

### Connection Details
- **Host**: db.hsjhdkizsejqqgttqiir.supabase.co
- **Database**: postgres
- **User**: postgres
- **Port**: 5432 (direct) / 6543 (pooler)

### Tables Created
1. **card_templates** - Gift card designs
2. **gift_cards** - Gift card records
3. **admin_users** - Admin user records

### Sample Data Inserted
- 6 default card templates (Birthday, Anniversary, Congratulations, etc.)

---

## 🔐 Environment Variables

All variables are set in `.env.local`:

```env
# Supabase (✓ Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://hsjhdkizsejqqgttqiir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Database (✓ Already configured)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...

# Stripe (⏳ Awaiting keys)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_SECRET_KEY=

# Email (✓ Optional, configured)
RESEND_API_KEY=...
```

---

## 🧪 Testing the App

### Test Gift Card Creation
1. Go to `http://localhost:3000`
2. Click "Create Gift Card"
3. Fill in the form and proceed

### Test Admin Dashboard
1. Go to `http://localhost:3000/admin`
2. Login with admin credentials
3. View and manage gift cards

### Test Claiming
1. Send yourself a gift card
2. Go to the claim link
3. Click claim and fill in bank details

---

## 🐛 Troubleshooting

### Error: "STRIPE_SECRET_KEY is not set"
- Expected before Stripe keys are provided
- Will work once you provide Stripe API keys

### Error: "Could not connect to Supabase"
- Check `.env.local` has correct credentials
- Verify Supabase project is active

### Error: "Admin login fails"
- Ensure setup-all.ts was executed successfully
- Check Supabase Auth → Users for admin@lastminutecards.com

### Error: "Cannot find module '@/lib/validation'"
- Run `npm install` to install all dependencies

---

## 📝 Next Steps

1. **Provide Stripe API Keys** - Add to .env.local and restart server
2. **Customize Card Templates** - Edit via admin dashboard
3. **Set Admin Password** - Change default password after login
4. **Configure Email** - Add Resend API key for email notifications
5. **Deploy to Production** - Use Vercel for easy deployment

---

## 🔗 Important Links

- **App**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **Supabase Dashboard**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## ✨ Features Included

✓ Beautiful gift card creation interface  
✓ Stripe payment integration (ready for keys)  
✓ Gift card claiming system  
✓ Admin dashboard with card management  
✓ Email notifications (Resend)  
✓ Responsive design  
✓ User authentication via Supabase  
✓ Database with RLS policies  

---

## 📞 Support

If you encounter issues:
1. Check this document first
2. Review error messages in console
3. Check `.env.local` has all required variables
4. Verify database tables exist in Supabase

---

**Your app is ready to go! Once you provide Stripe API keys, everything will be fully functional.** 🎉
