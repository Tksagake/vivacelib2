import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    step1_env_vars: {
      status: 'checking',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: ''
    },
    step2_validation: {
      status: 'pending',
      url_format: false,
      key_format: false,
      errors: [] as string[]
    },
    step3_connection: {
      status: 'pending',
      can_connect: false,
      error: null as string | null
    },
    step4_database_test: {
      status: 'pending',
      can_query: false,
      tables_exist: false,
      error: null as string | null
    },
    diagnosis: '',
    next_steps: [] as string[]
  };

  // Step 1: Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  results.step1_env_vars.NEXT_PUBLIC_SUPABASE_URL = url ? `✓ Set (${url.substring(0, 30)}...)` : '✗ NOT SET';
  results.step1_env_vars.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey ? `✓ Set (${anonKey.substring(0, 20)}...)` : '✗ NOT SET';
  results.step1_env_vars.SUPABASE_SERVICE_ROLE_KEY = serviceKey ? `✓ Set (${serviceKey.substring(0, 20)}...)` : '✗ NOT SET';

  if (!url || (!anonKey && !serviceKey)) {
    results.step1_env_vars.status = 'failed';
    results.diagnosis = '❌ Environment variables are not set correctly in Vercel';
    results.next_steps = [
      '1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      '2. Add NEXT_PUBLIC_SUPABASE_URL (your Supabase project URL)',
      '3. Add NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase Settings → API)',
      '4. Redeploy your application'
    ];
    return NextResponse.json(results, { status: 500 });
  }
  results.step1_env_vars.status = 'passed';

  // Step 2: Validate format
  results.step2_validation.status = 'checking';
  
  // Sanitize values
  const cleanUrl = url.trim().replace(/^["']|["']$/g, '');
  const cleanKey = (serviceKey || anonKey).trim().replace(/^["']|["']$/g, '');

  // Validate URL
  try {
    new URL(cleanUrl);
    if (cleanUrl.includes('supabase.co') || cleanUrl.includes('supabase.in')) {
      results.step2_validation.url_format = true;
    } else {
      results.step2_validation.errors.push('URL does not contain supabase.co or supabase.in');
    }
  } catch {
    results.step2_validation.errors.push('URL is not a valid URL format');
  }

  // Validate key
  if (cleanKey.startsWith('eyJ') && cleanKey.length > 100) {
    results.step2_validation.key_format = true;
  } else {
    if (!cleanKey.startsWith('eyJ')) {
      results.step2_validation.errors.push('API key does not start with "eyJ" (not a valid JWT token)');
    }
    if (cleanKey.length <= 100) {
      results.step2_validation.errors.push(`API key is too short (${cleanKey.length} characters, should be 100+)`);
    }
  }

  if (results.step2_validation.errors.length > 0) {
    results.step2_validation.status = 'failed';
    results.diagnosis = '❌ API key format is invalid';
    results.next_steps = [
      '1. Go to Supabase Dashboard → Settings → API',
      '2. Copy the FULL "anon public" key (it\'s very long)',
      '3. In Vercel, DELETE the old NEXT_PUBLIC_SUPABASE_ANON_KEY',
      '4. Add a NEW one - paste the FULL key WITHOUT quotes',
      '5. Make sure no spaces before or after the key',
      '6. Redeploy your application',
      '',
      'Current issues detected:',
      ...results.step2_validation.errors
    ];
    return NextResponse.json(results, { status: 500 });
  }
  results.step2_validation.status = 'passed';

  // Step 3: Test connection
  results.step3_connection.status = 'checking';
  
  try {
    const supabase = createClient(cleanUrl, cleanKey);
    results.step3_connection.can_connect = true;
    results.step3_connection.status = 'passed';

    // Step 4: Test database query
    results.step4_database_test.status = 'checking';
    
    try {
      // Try a simple query to see if we can connect to the database
      const { data, error } = await supabase
        .from('chat_threads')
        .select('id')
        .limit(1);

      if (error) {
        // Check the specific error
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          results.step4_database_test.status = 'failed';
          results.step4_database_test.error = error.message;
          results.diagnosis = '❌ API KEY IS WRONG FOR THIS PROJECT!';
          results.next_steps = [
            '🔴 CRITICAL: Your API key does not match your Supabase project!',
            '',
            'This means you are using an API key from a DIFFERENT Supabase project.',
            '',
            'TO FIX:',
            '1. Go to Supabase Dashboard (https://app.supabase.com)',
            '2. Make sure you are in the CORRECT project',
            '3. Check the project URL matches your NEXT_PUBLIC_SUPABASE_URL',
            '4. Go to Settings → API',
            '5. Copy the keys from THIS project (not another one)',
            '6. Update ALL keys in Vercel environment variables',
            '7. Redeploy',
            '',
            `Error from Supabase: ${error.message}`
          ];
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
          results.step4_database_test.status = 'failed';
          results.step4_database_test.error = error.message;
          results.diagnosis = '⚠️ API key works but table does not exist';
          results.next_steps = [
            'Good news: Your API key is VALID! ✓',
            'Issue: The chat_threads table does not exist in your database',
            '',
            'TO FIX:',
            '1. Go to Supabase Dashboard → SQL Editor',
            '2. Copy contents of: supabase/migrations/20260203_create_chat_tables.sql',
            '3. Paste and run in SQL Editor',
            '4. Verify tables appear in Table Editor'
          ];
        } else {
          results.step4_database_test.status = 'failed';
          results.step4_database_test.error = error.message;
          results.diagnosis = '⚠️ Database query failed';
          results.next_steps = [
            `Error: ${error.message}`,
            '',
            'Check:',
            '1. RLS policies (you said you disabled them)',
            '2. Table permissions',
            '3. Supabase project status (not paused)'
          ];
        }
      } else {
        results.step4_database_test.can_query = true;
        results.step4_database_test.tables_exist = true;
        results.step4_database_test.status = 'passed';
        results.diagnosis = '✅ EVERYTHING WORKS! Your API key and database are configured correctly!';
        results.next_steps = [
          'Your Supabase connection is working perfectly!',
          'If you still get errors in your app:',
          '1. Clear browser cache completely',
          '2. Close all browser tabs',
          '3. Wait 2-3 minutes for Vercel to update',
          '4. Try again in a fresh browser tab'
        ];
      }
    } catch (dbError) {
      results.step4_database_test.status = 'failed';
      results.step4_database_test.error = dbError instanceof Error ? dbError.message : String(dbError);
      results.diagnosis = '❌ Failed to query database';
      results.next_steps = [
        'Could not test database query',
        `Error: ${results.step4_database_test.error}`
      ];
    }
  } catch (connError) {
    results.step3_connection.status = 'failed';
    results.step3_connection.error = connError instanceof Error ? connError.message : String(connError);
    results.diagnosis = '❌ Failed to create Supabase client';
    results.next_steps = [
      'Could not connect to Supabase',
      `Error: ${results.step3_connection.error}`,
      '',
      'This usually means the API key format is wrong.',
      'Go to Supabase Dashboard and get a fresh copy of your API keys.'
    ];
  }

  const statusCode = results.diagnosis.includes('✅') ? 200 : 500;
  return NextResponse.json(results, { status: statusCode });
}
