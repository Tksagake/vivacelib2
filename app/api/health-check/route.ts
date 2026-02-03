import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      deepseekApiKey: !!process.env.DEEPSEEK_API_KEY,
    },
    database: {
      canConnect: false,
      tables: {
        chat_threads: false,
        chat_messages: false,
        chat_uploads: false,
      },
      errors: [] as string[],
    },
    overall: 'unknown' as 'healthy' | 'degraded' | 'unhealthy' | 'unknown',
  };

  // Check Supabase connection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test chat_threads table
      const { data: threadsData, error: threadsError } = await supabase
        .from('chat_threads')
        .select('id')
        .limit(1);
      
      if (threadsError) {
        checks.database.errors.push(`chat_threads: ${threadsError.message}`);
      } else {
        checks.database.canConnect = true;
        checks.database.tables.chat_threads = true;
      }
      
      // Test chat_messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('id')
        .limit(1);
      
      if (messagesError) {
        checks.database.errors.push(`chat_messages: ${messagesError.message}`);
      } else {
        checks.database.tables.chat_messages = true;
      }
      
      // Test chat_uploads table
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('chat_uploads')
        .select('id')
        .limit(1);
      
      if (uploadsError) {
        checks.database.errors.push(`chat_uploads: ${uploadsError.message}`);
      } else {
        checks.database.tables.chat_uploads = true;
      }
      
    } catch (error) {
      checks.database.errors.push(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    checks.database.errors.push('Supabase credentials not configured');
  }

  // Determine overall health
  const allEnvVars = checks.environment.supabaseUrl && checks.environment.supabaseAnonKey;
  const allTables = checks.database.tables.chat_threads && 
                     checks.database.tables.chat_messages && 
                     checks.database.tables.chat_uploads;
  
  if (allEnvVars && allTables) {
    checks.overall = 'healthy';
  } else if (allEnvVars || checks.database.canConnect) {
    checks.overall = 'degraded';
  } else {
    checks.overall = 'unhealthy';
  }

  const statusCode = checks.overall === 'healthy' ? 200 : 
                     checks.overall === 'degraded' ? 207 : 500;

  return NextResponse.json(checks, { status: statusCode });
}
