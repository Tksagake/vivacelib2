import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// GET - Fetch all messages for a thread
export async function GET(req: NextRequest) {
  if (!supabase) {
    console.error('Supabase not configured for chat-messages GET');
    return NextResponse.json(
      { 
        error: 'Supabase configuration missing',
        details: 'Environment variables not set'
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');
    const userId = searchParams.get('userId');

    if (!threadId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: threadId, userId' },
        { status: 400 }
      );
    }

    // Verify thread belongs to user
    const { data: thread, error: threadError } = await supabase
      .from('chat_threads')
      .select('id')
      .eq('id', threadId)
      .eq('user_id', userId)
      .single();

    if (threadError || !thread) {
      console.error('Thread verification error:', threadError);
      return NextResponse.json(
        { 
          error: 'Thread not found or access denied',
          details: threadError?.message,
          hint: 'Check if chat_threads table exists and RLS policies allow access'
        },
        { status: 404 }
      );
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id, role, content, sequence, created_at')
      .eq('thread_id', threadId)
      .order('sequence', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      console.error('Error details:', JSON.stringify(messagesError, null, 2));
      return NextResponse.json(
        { 
          error: 'Failed to fetch messages',
          details: messagesError.message,
          hint: 'Check if chat_messages table exists'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('GET messages error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
