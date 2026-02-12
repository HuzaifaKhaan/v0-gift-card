import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const adminEmail = "admin@lastminutecards.com";
  const adminPassword = "LastMinute@Admin2024";

  console.log("\n🔐 Creating admin user...\n");

  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Add to admin_users table
    const { data, error: dbError } = await supabase
      .from("admin_users")
      .insert({
        email: adminEmail,
        password_hash: passwordHash,
        full_name: "Admin",
        is_active: true,
      })
      .select();

    if (dbError) {
      if (dbError.message.includes("duplicate")) {
        console.log("⚠️  Admin user already exists");
      } else {
        console.error("Error creating admin user:", dbError);
        process.exit(1);
      }
    } else {
      console.log("✓ Admin user created successfully!");
    }

    console.log("\n" + "=".repeat(50));
    console.log("📧 ADMIN LOGIN CREDENTIALS");
    console.log("=".repeat(50));
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("=".repeat(50));
    console.log("\n🌐 Admin Login: http://localhost:3000/admin/login");
    console.log("\n⚠️  IMPORTANT: Change this password immediately after first login!");
    console.log("");
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

createAdminUser();
