# Environment Variables Guide

## Required Variables

### Supabase (Database & Auth)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key for client-side
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side admin operations

### Stripe (Payments)
- `STRIPE_SECRET_KEY` - Server-side Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe dashboard

### Resend (Email)
- `RESEND_API_KEY` - API key for sending emails
- `RESEND_FROM_EMAIL` - Verified sender email address

### Vercel Blob (File Storage)
- `BLOB_READ_WRITE_TOKEN` - Token for blob storage operations

### Application
- `NEXT_PUBLIC_APP_URL` - Your application URL (for emails and redirects)
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - Local development redirect URL (optional)

## Unnecessary Variables (Can be removed)

These are automatically provided by Supabase integration:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_ANON_KEY` (duplicate of NEXT_PUBLIC_SUPABASE_ANON_KEY)
- `SUPABASE_URL` (duplicate of NEXT_PUBLIC_SUPABASE_URL)
- `STRIPE_PUBLISHABLE_KEY` (duplicate of NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
- `STRIPE_MCP_KEY` (internal Stripe integration, not used in code)

## How to Clean Up

You can safely remove the unnecessary variables from your Vercel project settings without affecting functionality.
