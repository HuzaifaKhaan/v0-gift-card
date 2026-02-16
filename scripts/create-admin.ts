import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
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

  console.log("\n🔐 Creating admin user via Supabase Auth...\n");

  try {
    // Create user via Supabase Auth with admin role
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
        console.log("⚠️  Admin user already exists in Supabase Auth");
      } else {
        console.error("Error creating Supabase Auth user:", authError);
        process.exit(1);
      }
    } else {
      console.log("✓ Admin user created successfully via Supabase Auth!");
      console.log(`  User ID: ${authData.user.id}`);
    }

    // Also add to admin_users table for reference
    const { error: dbError } = await supabase
      .from("admin_users")
      .insert({
        email: adminEmail,
        password_hash: "managed_by_supabase_auth",
        full_name: "Administrator",
        is_active: true,
      })
      .select();

    if (dbError && !dbError.message.includes("duplicate")) {
      console.warn("Warning: Could not add to admin_users table:", dbError.message);
    } else if (!dbError) {
      console.log("✓ Admin user added to admin_users table");
    }

    console.log("\n" + "=".repeat(60));
    console.log("ADMIN LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("=".repeat(60));
    console.log("\n🌐 Admin Login: http://localhost:3000/admin/login");
    console.log("📊 Admin Dashboard: http://localhost:3000/admin");
    console.log("\n⚠️  IMPORTANT: Change this password immediately after first login!");
    console.log(
      "💡 Tip: You can change password in the Supabase Auth settings (cogwheel > Auth)."
    );
    console.log("");
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

createAdminUser();
