import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log("Setting up database tables...");

    // Create card_templates table
    const { error: templatesError } = await supabase.rpc(
      "create_card_templates_table",
      {}
    );

    if (templatesError && !templatesError.message.includes("already exists")) {
      console.error("Error creating card_templates table:", templatesError);
    } else {
      console.log("✓ card_templates table ready");
    }

    // Create gift_cards table
    const { error: cardsError } = await supabase.rpc(
      "create_gift_cards_table",
      {}
    );

    if (cardsError && !cardsError.message.includes("already exists")) {
      console.error("Error creating gift_cards table:", cardsError);
    } else {
      console.log("✓ gift_cards table ready");
    }

    // Create admin_users table
    const { error: adminError } = await supabase.rpc(
      "create_admin_users_table",
      {}
    );

    if (adminError && !adminError.message.includes("already exists")) {
      console.error("Error creating admin_users table:", adminError);
    } else {
      console.log("✓ admin_users table ready");
    }

    console.log("\nDatabase setup complete!");
    console.log(
      "\nNext, run: npm run create-admin to create an admin account"
    );
  } catch (error) {
    console.error("Database setup error:", error);
    process.exit(1);
  }
}

setupDatabase();
