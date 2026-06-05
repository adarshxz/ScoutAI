import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables are missing! " +
    "Please make sure to configure them in your environment or Render settings and redeploy."
  );
}

// Fallback to placeholder credentials to avoid crashing during JS module evaluation
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project-id.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

