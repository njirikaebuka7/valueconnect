export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * False until the Supabase env vars are set. The public site then runs in
 * preview mode on the sample listings, and the admin shows setup steps.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
