import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - List all threads for a user
export async function GET(req: NextRequest) {
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
      return NextResponse.json(
        { error: 'Failed to fetch threads' },
        { status: 500 }
      );
    }

    return NextResponse.json({ threads: threads || [] });
  } catch (error) {
    console.error('GET threads error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create a new thread
export async function POST(req: NextRequest) {
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
      return NextResponse.json(
        { error: 'Failed to create thread' },
        { status: 500 }
      );
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('POST thread error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH - Update a thread (e.g., archive, change title)
export async function PATCH(req: NextRequest) {
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
