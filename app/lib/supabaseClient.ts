import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Initialize Supabase client only once
const supabase = createClientComponentClient();

export default supabase;
