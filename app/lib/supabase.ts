import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern to ensure only one Supabase client instance
// This prevents "Multiple GoTrueClient instances" warning
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

// Export a default instance for convenience
export const supabase = getSupabaseClient();