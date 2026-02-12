import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createAdminUser() {
  const adminEmail = "admin@lastminutecards.com";
  const adminPassword = "LastMinute2024!Admin"; // You should change this!

  console.log("Creating admin user...");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log("");

  try {
    // Create the user via Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: "admin",
        name: "Admin",
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      process.exit(1);
    }

    console.log("✓ Auth user created successfully");
    console.log(`  User ID: ${authData.user.id}`);

    // Add to admin_users table
    const { error: dbError } = await supabase.from("admin_users").insert({
      id: authData.user.id,
      email: adminEmail,
      role: "admin",
    });

    if (dbError) {
      console.error("Error adding to admin_users table:", dbError);
      // This might fail if the user already exists, which is okay
    } else {
      console.log("✓ Admin user added to admin_users table");
    }

    console.log("");
    console.log("Admin account created successfully!");
    console.log("");
    console.log("Login credentials:");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log("");
    console.log("⚠️  IMPORTANT: Change the password immediately after first login!");
    console.log("");
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

createAdminUser();
