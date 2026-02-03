import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Sanitize environment variables (trim whitespace and quotes)
const sanitizeEnvVar = (value: string | undefined): string => {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
};

const supabaseUrl = sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseServiceKey = sanitizeEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY) || sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.includes('supabase.co') || url.includes('supabase.in');
  } catch {
    return false;
  }
};

// Validate API key format (should start with 'eyJ')
const isValidApiKey = (key: string): boolean => {
  return key.length > 20 && key.startsWith('eyJ');
};

let supabase: SupabaseClient | null = null;
let configError: string | null = null;

if (!supabaseUrl) {
  configError = 'NEXT_PUBLIC_SUPABASE_URL is not set';
} else if (!isValidUrl(supabaseUrl)) {
  configError = `NEXT_PUBLIC_SUPABASE_URL is invalid. Got: ${supabaseUrl.substring(0, 50)}...`;
} else if (!supabaseServiceKey) {
  configError = 'Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is set';
} else if (!isValidApiKey(supabaseServiceKey)) {
  configError = `Supabase API key appears to be invalid or malformed. Key should start with 'eyJ' and be a JWT token. Got: ${supabaseServiceKey.substring(0, 20)}...`;
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    configError = `Failed to create Supabase client: ${error instanceof Error ? error.message : String(error)}`;
  }
}

// GET - List all threads for a user
export async function GET(req: NextRequest) {
  if (!supabase || configError) {
    console.error('Supabase configuration error:', configError);
    console.error('Environment variables status:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? `Set (${sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL).substring(0, 30)}...)` : 'Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `Set (${sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).substring(0, 20)}...)` : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? `Set (${sanitizeEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY).substring(0, 20)}...)` : 'Missing');
    
    return NextResponse.json(
      { 
        error: 'Supabase configuration error',
        details: configError || 'Unknown configuration error',
        troubleshooting: {
          common_issues: [
            'API keys should start with "eyJ" (JWT format)',
            'Check for extra spaces or quotes around environment variables',
            'Verify URL matches your Supabase project (should contain supabase.co)',
            'Ensure keys are from the correct project in Supabase Dashboard'
          ],
          how_to_fix: [
            '1. Go to Supabase Dashboard → Settings → API',
            '2. Copy URL and anon/service_role keys',
            '3. In Vercel → Settings → Environment Variables',
            '4. Paste keys WITHOUT extra spaces or quotes',
            '5. Redeploy your application'
          ]
        }
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('id, title, model, status, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching threads:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check for Invalid API key error
      const isInvalidApiKey = error.message?.toLowerCase().includes('invalid api key') || 
                              error.message?.toLowerCase().includes('invalid jwt') ||
                              error.code === 'PGRST301';
      
      if (isInvalidApiKey) {
        return NextResponse.json(
          { 
            error: 'Invalid Supabase API key',
            details: error.message,
            hint: '⚠️ Your Supabase API key is invalid or malformed!',
            apiKeyIssue: true,
            troubleshooting: {
              problem: 'The API key in your environment variables is not valid',
              common_causes: [
                'Extra spaces or quotes around the API key',
                'Copied incomplete key (missing characters)',
                'Using key from wrong Supabase project',
                'Using expired or revoked key',
                'Special characters not properly escaped'
              ],
              how_to_fix: [
                '1. Go to Supabase Dashboard → Settings → API',
                '2. Find your project API keys',
                '3. Copy the FULL "anon public" key (starts with eyJ)',
                '4. Go to Vercel → Settings → Environment Variables',
                '5. Delete old NEXT_PUBLIC_SUPABASE_ANON_KEY',
                '6. Add new one - paste key WITHOUT any quotes or spaces',
                '7. Also copy and set SUPABASE_SERVICE_ROLE_KEY (recommended)',
                '8. Redeploy your application',
                '9. Clear browser cache and try again'
              ],
              verify: [
                'Key should start with: eyJ',
                'Key should be very long (100+ characters)',
                'Key should be one continuous string with no spaces',
                'URL should match: https://YOUR_PROJECT.supabase.co'
              ]
            }
          },
          { status: 500 }
        );
      }
      
      // Check if it's a "table doesn't exist" error
      const tableNotExist = error.message?.includes('relation') && error.message?.includes('does not exist');
      const migrationNeeded = tableNotExist || error.code === '42P01';
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch threads',
          details: error.message,
          errorCode: error.code,
          hint: migrationNeeded 
            ? '⚠️ DATABASE TABLES DO NOT EXIST! You need to run the migration in Supabase SQL Editor. See TROUBLESHOOTING.md for instructions.'
            : 'Check if chat_threads table exists and RLS policies allow access',
          migrationRequired: migrationNeeded,
          troubleshooting: migrationNeeded ? {
            step1: 'Go to Supabase Dashboard → SQL Editor',
            step2: 'Copy contents of: supabase/migrations/20260203_create_chat_tables.sql',
            step3: 'Paste into SQL Editor and click Run',
            step4: 'Verify tables appear in Table Editor',
            step5: 'Refresh your app and try again'
          } : {
            step1: 'Check Supabase function logs for detailed error',
            step2: 'Verify RLS policies allow your user to access data',
            step3: 'Check if API keys are correctly configured',
            step4: 'Verify database connection in Supabase Dashboard'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ threads: threads || [] });
  } catch (error) {
    console.error('GET threads error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST - Create a new thread
export async function POST(req: NextRequest) {
  if (!supabase || configError) {
    console.error('Supabase configuration error for POST:', configError);
    return NextResponse.json(
      { 
        error: 'Supabase configuration error',
        details: configError || 'Unknown configuration error',
        troubleshooting: {
          common_issues: [
            'API keys should start with "eyJ" (JWT format)',
            'Check for extra spaces or quotes around environment variables',
            'Verify URL matches your Supabase project (should contain supabase.co)',
            'Ensure keys are from the correct project in Supabase Dashboard'
          ]
        }
      },
      { status: 500 }
    );
  }

  try {
    const { userId, title, model } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    const { data: thread, error } = await supabase
      .from('chat_threads')
      .insert({
        user_id: userId,
        title: title || 'New Conversation',
        model: model || 'deepseek-chat',
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating thread:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a "table doesn't exist" error
      const tableNotExist = error.message?.includes('relation') && error.message?.includes('does not exist');
      const migrationNeeded = tableNotExist || error.code === '42P01';
      
      return NextResponse.json(
        { 
          error: 'Failed to create thread',
          details: error.message,
          hint: migrationNeeded 
            ? '⚠️ DATABASE TABLES DO NOT EXIST! You need to run the migration in Supabase SQL Editor. See TROUBLESHOOTING.md for instructions.'
            : 'Check if chat_threads table exists in database and RLS policies are configured',
          migrationRequired: migrationNeeded,
          troubleshooting: migrationNeeded ? {
            step1: 'Go to Supabase Dashboard → SQL Editor',
            step2: 'Copy contents of: supabase/migrations/20260203_create_chat_tables.sql',
            step3: 'Paste into SQL Editor and click Run',
            step4: 'Verify tables appear in Table Editor',
            step5: 'Refresh your app and try again'
          } : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('POST thread error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// PATCH - Update a thread (e.g., archive, change title)
export async function PATCH(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { threadId, userId, title, status } = await req.json();

    if (!threadId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: threadId, userId' },
        { status: 400 }
      );
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;

    const { data: thread, error } = await supabase
      .from('chat_threads')
      .update(updates)
      .eq('id', threadId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating thread:', error);
      return NextResponse.json(
        { error: 'Failed to update thread' },
        { status: 500 }
      );
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('PATCH thread error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
