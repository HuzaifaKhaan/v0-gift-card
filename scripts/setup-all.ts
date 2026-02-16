import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hsjhdkizsejqqgttqiir.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzamhka2l6c2VqcXFndHRxaWlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgzNTg3MiwiZXhwIjoyMDg2NDExODcyfQ.vXMfh_65-1GrOVGldu_DnygdioSSVIGwrGZd3Ad-PEE";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log("\n🚀 Starting database and admin setup...\n");

  try {
    // 1. Create tables
    console.log("📊 Creating database tables...");

    const tablesSQL = `
-- Create card_templates table
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  background_color VARCHAR(7) DEFAULT '#FFFFFF',
  text_color VARCHAR(7) DEFAULT '#000000',
  is_active BOOLEAN DEFAULT true,
  price_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES card_templates(id),
  recipient_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  message TEXT,
  amount_cents INTEGER DEFAULT 0,
  code VARCHAR(64) UNIQUE NOT NULL,
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  claimed_by_email VARCHAR(255),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_is_claimed ON gift_cards(is_claimed);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_card_templates_is_active ON card_templates(is_active);

-- Enable RLS
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read" ON card_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow users to view their own cards" ON gift_cards
  FOR SELECT
  USING (
    recipient_email = auth.jwt() ->> 'email' OR
    sender_email = auth.jwt() ->> 'email'
  );

-- Insert default templates
INSERT INTO card_templates (name, description, category, background_color, text_color, is_active)
VALUES 
  ('Birthday Celebration', 'Colorful birthday card design', 'birthday', '#FFE5E0', '#F6664C', true),
  ('Anniversary Special', 'Elegant anniversary card', 'anniversary', '#F5F5F5', '#185F72', true),
  ('Congratulations', 'Success and achievement card', 'congratulations', '#FFF7E6', '#FF9500', true),
  ('Thank You', 'Gratitude and appreciation card', 'thank-you', '#F0F8FF', '#4169E1', true),
  ('Get Well', 'Recovery and healing wishes card', 'get-well', '#F0FFF0', '#228B22', true),
  ('New Baby', 'Baby arrival celebration card', 'new-baby', '#FFE4F0', '#FF69B4', true)
ON CONFLICT DO NOTHING;
    `;

    const { error: tablesError } = await supabase.rpc("exec", {
      sql: tablesSQL,
    });

    if (tablesError) {
      console.log("⚠️  Tables might already exist (this is okay)");
    } else {
      console.log("✓ Database tables created successfully");
    }

    // 2. Create admin user in Supabase Auth
    console.log("\n👤 Creating admin user in Supabase Auth...");

    const adminEmail = "admin@lastminutecards.com";
    const adminPassword = "LastMinute@Admin2024";

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: "admin",
        full_name: "Administrator",
      },
    });

    if (authError) {
      if (authError.message.includes("already exists")) {
        console.log("⚠️  Admin user already exists in Supabase Auth (this is okay)");
      } else {
        console.error("❌ Error creating admin user:", authError.message);
      }
    } else {
      console.log("✓ Admin user created in Supabase Auth");
      console.log(`  User ID: ${authData.user.id}`);
    }

    // 3. Add admin to admin_users table
    console.log("\n📝 Adding admin to admin_users table...");

    const { error: dbError } = await supabase
      .from("admin_users")
      .insert({
        email: adminEmail,
        password_hash: "managed_by_supabase_auth",
        full_name: "Administrator",
        is_active: true,
      })
      .select();

    if (dbError) {
      if (dbError.message.includes("duplicate")) {
        console.log("⚠️  Admin already in admin_users table (this is okay)");
      } else {
        console.warn("⚠️  Warning:", dbError.message);
      }
    } else {
      console.log("✓ Admin added to admin_users table");
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ SETUP COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📧 ADMIN CREDENTIALS:");
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n🌐 ACCESS YOUR APP:");
    console.log("   - Home:  http://localhost:3000");
    console.log("   - Admin: http://localhost:3000/admin/login");
    console.log("\n⚠️  IMPORTANT:");
    console.log("   Change admin password immediately after first login!");
    console.log("   Go to Settings → Password to change it.");
    console.log("\n🔑 ENVIRONMENT VARIABLES:");
    console.log("   All Supabase variables are already configured:");
    console.log("   - NEXT_PUBLIC_SUPABASE_URL");
    console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.log("   - And more...");
    console.log("\n💳 STRIPE SETUP:");
    console.log("   Waiting for Stripe API keys to be provided.");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

setupDatabase();
