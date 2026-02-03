# AI Tutor System Implementation Guide

## Overview

This implementation provides a contextual AI tutor system for music education using Supabase, PostgreSQL, and Next.js. The system supports per-student conversational memory with strict academic music education scope.

## Features

1. **Thread-based Conversations**: Each conversation is a separate thread with persistent message history
2. **File Upload Support**: Upload PDFs, PNG, and JPEG files with automatic text extraction
3. **Text Extraction**: 
   - PDF text layer extraction
   - OCR for images using Tesseract.js
4. **Academic Scope Enforcement**: AI only responds to music-related academic questions
5. **Contextual Memory**: AI has access to all messages and uploaded materials in the current thread

## Database Setup

### 1. Run the Migration

Execute the SQL migration file located at `supabase/migrations/20260203_create_chat_tables.sql` in your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard:
# Go to SQL Editor and execute the migration file
```

This will create:
- `chat_threads` table
- `chat_messages` table
- `chat_uploads` table
- `chat-uploads` storage bucket
- Row Level Security (RLS) policies

### 2. Verify Storage Bucket

Ensure the `chat-uploads` storage bucket is created and configured:
- Bucket name: `chat-uploads`
- Public access: No (private)
- File size limit: 10MB recommended

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## API Endpoints

### 1. Thread Management (`/api/chat-threads`)

**GET** - List all threads for a user
```typescript
GET /api/chat-threads?userId={userId}
Response: { threads: Thread[] }
```

**POST** - Create a new thread
```typescript
POST /api/chat-threads
Body: { userId: string, title?: string, model?: string }
Response: { thread: Thread }
```

**PATCH** - Update a thread
```typescript
PATCH /api/chat-threads
Body: { threadId: string, userId: string, title?: string, status?: 'active' | 'archived' }
Response: { thread: Thread }
```

### 2. Messages (`/api/chat-messages`)

**GET** - Fetch messages for a thread
```typescript
GET /api/chat-messages?threadId={threadId}&userId={userId}
Response: { messages: Message[] }
```

### 3. File Upload (`/api/chat-upload`)

**POST** - Upload a file
```typescript
POST /api/chat-upload
Body: FormData {
  file: File,
  threadId: string,
  userId: string
}
Response: { success: boolean, uploadId: string, fileName: string }
```

Supported file types:
- PDF (application/pdf)
- PNG (image/png)
- JPEG (image/jpeg)

Max file size: 10MB

### 4. Chat (`/api/deepseek-chat`)

**POST** - Send a message and get AI response
```typescript
POST /api/deepseek-chat
Body: {
  threadId: string,
  userId: string,
  userMessage: string
}
Response: { message: string }
```

## Usage Flow

### Starting a New Conversation

1. User visits `/chat` page
2. System creates a new thread automatically on first message
3. User types a message and sends
4. System:
   - Saves user message to `chat_messages`
   - Loads all prior messages and uploads
   - Assembles context with system prompt
   - Calls DeepSeek API
   - Saves assistant response to `chat_messages`
   - Returns response to user

### Uploading Files

1. User clicks upload button
2. Selects a PDF, PNG, or JPEG file
3. System:
   - Validates file type and size
   - Uploads to Supabase Storage at `{userId}/{threadId}/{uploadId}/{filename}`
   - Creates record in `chat_uploads` with status 'pending'
   - Extracts text asynchronously
   - Updates record with extracted text and status 'processed'
4. On next message, extracted text is included as system message

### Academic Scope Enforcement

The system prompt ensures the AI:
- Only answers music-related academic questions
- Refuses personal, medical, legal, sexual, or political queries
- Maintains professional tutor tone
- Has no memory beyond current thread

Example refusal response:
```
"I can only assist with music-related academic topics."
```

## Storage Path Format

Files are stored with the following path structure:
```
{user_id}/{thread_id}/{upload_id}/{original_filename}
```

Example:
```
550e8400-e29b-41d4-a716-446655440000/
  ├── 7c9e6679-7425-40de-944b-e07fc1f90ae7/
  │   └── 8f14e45f-ceea-467a-9c49-8d36d52a6b3c/
  │       └── music-theory.pdf
```

## Text Extraction Process

### PDF Files
1. First attempts to extract text from PDF text layer
2. If successful, uses extracted text
3. If no text found, marks as processed (OCR for PDF pages requires additional setup)

### Image Files
1. Uses Tesseract.js OCR
2. Extracts text in English language
3. Saves extracted text to database

### Status Flow
```
pending → processed (success)
pending → failed (error during extraction)
```

## Security Features

### Row Level Security (RLS)
- Users can only access their own threads, messages, and uploads
- Storage policies enforce user-specific access
- All operations verified by user ID

### File Validation
- Only allowed MIME types accepted
- File size limits enforced (10MB)
- No executable files allowed

### API Security
- All endpoints validate user ownership
- Service role key used for privileged operations
- Error messages don't leak sensitive information

## Testing

### Manual Testing Checklist

1. **Thread Creation**
   - [ ] Create new thread on first message
   - [ ] Thread appears in sidebar
   - [ ] Thread title updates

2. **Messages**
   - [ ] Send user message
   - [ ] Receive AI response
   - [ ] Messages persist on page reload
   - [ ] Message history loads correctly

3. **File Uploads**
   - [ ] Upload PDF file
   - [ ] Upload PNG image
   - [ ] Upload JPEG image
   - [ ] Verify file size limit
   - [ ] Verify file type restriction
   - [ ] Check text extraction

4. **Academic Scope**
   - [ ] Ask music theory question → Should answer
   - [ ] Ask personal advice → Should refuse
   - [ ] Ask political question → Should refuse
   - [ ] Ask medical question → Should refuse

5. **Context Assembly**
   - [ ] Upload file with text
   - [ ] Ask question about uploaded content
   - [ ] Verify AI references uploaded material

## Troubleshooting

### Build Errors
- Ensure all environment variables are set for production
- Check that Supabase URL and keys are correct
- Verify package dependencies are installed

### Runtime Errors
- Check browser console for client-side errors
- Check server logs for API errors
- Verify database tables are created
- Ensure storage bucket exists

### File Upload Issues
- Verify storage bucket permissions
- Check file size (max 10MB)
- Ensure file type is supported
- Check network tab for upload errors

### Text Extraction Not Working
- Check server logs for extraction errors
- Verify pdf-parse and tesseract.js are installed
- For large files, extraction may take time
- Check `chat_uploads` table for status

## Dependencies

### Core
- Next.js 15.5.9
- React 19.0.0
- @supabase/supabase-js 2.49.4

### Text Processing
- pdf-parse 2.4.5 (PDF text extraction)
- tesseract.js (OCR for images)

### AI
- DeepSeek API (configured via environment variable)

## Future Enhancements

Potential improvements not included in current scope:
- Video file processing (explicitly excluded)
- Audio file processing (explicitly excluded)
- Cross-thread memory (explicitly excluded)
- Advanced PDF OCR for scanned documents
- Multiple language support for OCR
- Real-time streaming responses
- Message editing and deletion
- Thread search functionality

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server and browser logs
3. Verify database and storage setup
4. Check Supabase dashboard for errors
