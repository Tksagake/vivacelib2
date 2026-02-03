import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// System prompt for academic music education tutor
const SYSTEM_PROMPT = `You are a professional music education tutor for a music school. Your role is to assist students strictly with music-related academic topics.

Your responsibilities:
- Answer questions about music theory, composition, performance, history, and analysis
- Help with Trinity College London exam preparation and music education
- Provide guidance on music notation, sight-reading, and ear training
- Explain musical concepts, terminology, and techniques
- Assist with music homework and study materials

Scope restrictions:
- ONLY answer music-related academic questions
- REFUSE personal, medical, legal, sexual, political, or non-academic queries
- Maintain a professional, educational tone suitable for students
- If a request is out of scope, respond: "I can only assist with music-related academic topics."

Memory limitations:
- You have no memory beyond the current conversation thread
- All context comes from the conversation history and uploaded materials provided
- Never assume knowledge not present in the conversation or uploads`;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
    responseLimit: false,
    externalResolver: true,
  },
};

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { threadId, userMessage, userId } = await req.json();

    if (!threadId || !userMessage || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: threadId, userMessage, userId' },
        { status: 400 }
      );
    }

    // Check if thread exists and belongs to user
    const { data: thread, error: threadError } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('id', threadId)
      .eq('user_id', userId)
      .single();

    if (threadError || !thread) {
      return NextResponse.json(
        { error: 'Thread not found or access denied' },
        { status: 404 }
      );
    }

    // Load all prior messages from the thread
    const { data: priorMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('role, content, sequence')
      .eq('thread_id', threadId)
      .order('sequence', { ascending: true });

    if (messagesError) {
      console.error('Error loading messages:', messagesError);
      return NextResponse.json(
        { error: 'Failed to load conversation history' },
        { status: 500 }
      );
    }

    // Load extracted text from uploads
    const { data: uploads, error: uploadsError } = await supabase
      .from('chat_uploads')
      .select('extracted_text, file_name, extraction_status')
      .eq('thread_id', threadId)
      .eq('extraction_status', 'processed')
      .not('extracted_text', 'is', null);

    if (uploadsError) {
      console.error('Error loading uploads:', uploadsError);
    }

    // Assemble messages for the LLM
    const messages: Array<{ role: string; content: string }> = [];

    // Add system prompt
    messages.push({ role: 'system', content: SYSTEM_PROMPT });

    // Add extracted upload text as system messages
    if (uploads && uploads.length > 0) {
      for (const upload of uploads) {
        if (upload.extracted_text) {
          messages.push({
            role: 'system',
            content: `Content from uploaded file "${upload.file_name}":\n\n${upload.extracted_text}`,
          });
        }
      }
    }

    // Add prior conversation messages
    if (priorMessages && priorMessages.length > 0) {
      for (const msg of priorMessages) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    // Get next sequence number
    const nextSequence = (priorMessages?.length || 0) + 1;

    // Save user message to database
    const { error: saveUserError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        role: 'user',
        content: userMessage,
        sequence: nextSequence,
      });

    if (saveUserError) {
      console.error('Error saving user message:', saveUserError);
      return NextResponse.json(
        { error: 'Failed to save user message' },
        { status: 500 }
      );
    }

    // Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = "https://api.deepseek.com/chat/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: thread.model || "deepseek-chat",
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from DeepSeek API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "No response from DeepSeek.";

    // Save assistant message to database
    const { error: saveAssistantError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        role: 'assistant',
        content: assistantMessage,
        sequence: nextSequence + 1,
      });

    if (saveAssistantError) {
      console.error('Error saving assistant message:', saveAssistantError);
    }

    // Update thread's updated_at timestamp
    await supabase
      .from('chat_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', threadId);

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
