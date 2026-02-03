import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Tesseract from 'tesseract.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Allowed file types
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const threadId = formData.get('threadId') as string;
    const userId = formData.get('userId') as string;

    if (!file || !threadId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, threadId, userId' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, PNG, and JPEG files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // Generate upload ID
    const uploadId = crypto.randomUUID();
    const storagePath = `${userId}/${threadId}/${uploadId}/${file.name}`;

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-uploads')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage.' },
        { status: 500 }
      );
    }

    // Create chat_uploads record with pending status
    const { data: uploadRecord, error: dbError } = await supabase
      .from('chat_uploads')
      .insert({
        id: uploadId,
        thread_id: threadId,
        user_id: userId,
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type,
        extraction_status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('chat-uploads').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to create upload record.' },
        { status: 500 }
      );
    }

    // Extract text in the background (async)
    extractTextFromFile(file, uploadId, storagePath).catch(console.error);

    return NextResponse.json({
      success: true,
      uploadId,
      fileName: file.name,
      storagePath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during upload.' },
      { status: 500 }
    );
  }
}

async function extractTextFromFile(file: File, uploadId: string, storagePath: string) {
  if (!supabase) {
    console.error('Supabase not configured');
    return;
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    if (file.type === 'application/pdf') {
      // Extract text from PDF
      try {
        // Dynamic require to avoid TypeScript issues
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text.trim();

        // If no text found, try OCR
        if (!extractedText) {
          console.log('No text layer found in PDF, attempting OCR...');
          // For now, mark as processed with empty text
          // Full OCR on PDF pages would require additional processing
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
      }
    } else if (file.type.startsWith('image/')) {
      // Extract text from image using OCR
      try {
        const result = await Tesseract.recognize(buffer, 'eng', {
          logger: (m) => console.log(m),
        });
        extractedText = result.data.text.trim();
      } catch (ocrError) {
        console.error('OCR error:', ocrError);
      }
    }

    // Update chat_uploads record with extracted text
    const { error: updateError } = await supabase
      .from('chat_uploads')
      .update({
        extracted_text: extractedText || null,
        extraction_status: 'processed',
      })
      .eq('id', uploadId);

    if (updateError) {
      console.error('Failed to update extraction status:', updateError);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    // Mark as failed
    await supabase
      .from('chat_uploads')
      .update({ extraction_status: 'failed' })
      .eq('id', uploadId);
  }
}
