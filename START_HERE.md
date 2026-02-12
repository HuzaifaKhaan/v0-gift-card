# START HERE - LastMinuteCards Setup Guide

Welcome! Your LastMinuteCards application is fully built and ready to go. Follow these steps to get started.

## Quick Summary

**The app is built. You need to:**
1. Create database tables (5 min)
2. Create admin user (2 min)  
3. Start the app (1 min)

**Total setup time: ~10 minutes**

---

## Admin Credentials

Copy these somewhere safe:

```
Email:    admin@lastminutecards.com
Password: LastMinute@Admin2024
```

⚠️ **Change this password after first login!**

---

## Setup Path

Pick your path based on your experience:

### 🚀 I'm in a hurry (8 minutes)
→ Read: **SETUP_QUICK_START.md**

### 📋 I want detailed instructions
→ Read: **DATABASE_SETUP.md**

### ✅ I want to verify everything
→ Read: **SETUP_VERIFICATION.md**

### 📊 I want to see what was built
→ Read: **PROJECT_COMPLETION_REPORT.md**

### 🔐 I need admin info
→ Read: **ADMIN_CREDENTIALS.md**

---

## The 3-Step Quick Setup

### Step 1: Create Tables (5 minutes)

```
1. Go to: https://app.supabase.com
2. Select your project
3. SQL Editor → New Query
4. Copy: scripts/init-tables.sql
5. Paste and Run
```

**Done!** You now have:
- card_templates (with 6 designs)
- gift_cards
- admin_users

### Step 2: Create Admin (2 minutes)

**Easy way - Supabase Dashboard:**

```
1. Authentication → Users
2. Click "Create user"
3. Email: admin@lastminutecards.com
4. Password: LastMinute@Admin2024
5. Add metadata: {"role": "admin", "full_name": "Administrator"}
6. Click "Create user"
```

**Or use script:**

```bash
npx ts-node scripts/create-admin.ts
```

### Step 3: Start App (1 minute)

```bash
npm install
npm run dev
```

Visit:
- App: http://localhost:3000
- Admin: http://localhost:3000/admin/login

---

## What's Included

✓ **Frontend**
- Home page with showcase
- Create gift card flow
- Checkout with Stripe
- Claim & redeem cards
- Admin dashboard

✓ **Backend**
- API routes
- Database integration
- Authentication
- Email sending
- Payment processing

✓ **Database**
- 3 tables with indexes
- Row Level Security
- Pre-loaded templates

✓ **Integrations**
- Supabase (database + auth)
- Stripe (payments)
- Resend (email)

---

## Environment Variables

Already configured in Vercel! Check your `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
RESEND_API_KEY=your_key
```

If missing, add them in Vercel Project Settings → Environment Variables

---

## First Login Checklist

After logging in to admin panel:

- [ ] Change your password
- [ ] Go to Settings → Configure Stripe webhook
- [ ] Go to Settings → Configure email templates
- [ ] Go to Templates → Review card designs
- [ ] Go to Templates → Set pricing
- [ ] Test creating a gift card
- [ ] Test claiming a gift card

---

## Common Issues & Solutions

**"relation does not exist" error**
→ Run the SQL migration (Step 1)

**"Invalid credentials" when logging in**
→ Make sure admin user exists in Supabase Auth (Authentication → Users)

**Images not loading**
→ Check that public images folder has the image files

**Stripe errors**
→ Configure webhook in Admin Settings

**Email not sending**
→ Check RESEND_API_KEY is set

**Still stuck?**
→ See SETUP_VERIFICATION.md troubleshooting section

---

## File Guide

| File | Purpose |
|------|---------|
| **SETUP_QUICK_START.md** | Fast 3-step setup |
| **DATABASE_SETUP.md** | Detailed database guide |
| **SETUP_VERIFICATION.md** | Checklist to verify setup |
| **PROJECT_COMPLETION_REPORT.md** | What was built |
| **ADMIN_CREDENTIALS.md** | Admin login info |
| **scripts/init-tables.sql** | Database migration |
| **scripts/create-admin.ts** | Create admin script |
| **.env.example** | Environment variables template |

---

## Features

Once set up, you'll have:

✅ **For Users**
- Create custom gift cards
- Add personal messages
- Pay with Stripe
- Send via email
- Claim with code
- Check balance
- Redeem rewards

✅ **For Admin**
- View all gift cards
- See claim status
- Manage templates
- Set pricing
- Configure email
- View analytics
- Process payments

---

## Next Steps After Setup

1. Customize card designs (Admin → Templates)
2. Set up Stripe webhook (Admin → Settings)
3. Configure email templates (Admin → Settings)
4. Send test gift cards
5. Verify email delivery
6. Deploy to production

---

## Need Help?

1. Check the documentation files listed above
2. Review Supabase dashboard (https://app.supabase.com)
3. Review Stripe dashboard (https://dashboard.stripe.com)
4. Check application logs: `npm run dev` output
5. Open browser console for client-side errors

---

## Ready? Let's Go!

1. **Pick your path** (see "Setup Path" section above)
2. **Follow the 3 steps** (create tables, create admin, start app)
3. **Log in** with admin credentials
4. **Customize** settings as needed
5. **Deploy** to production

---

## Questions?

- Setup questions? → SETUP_QUICK_START.md
- Database questions? → DATABASE_SETUP.md
- Verification issues? → SETUP_VERIFICATION.md
- Need admin info? → ADMIN_CREDENTIALS.md
- Want details? → PROJECT_COMPLETION_REPORT.md

---

## You're All Set! 🎉

Your LastMinuteCards app is ready to launch. The hardest part is done—now just follow the 3 setup steps and you're good to go!

**Happy coding!** 🚀
