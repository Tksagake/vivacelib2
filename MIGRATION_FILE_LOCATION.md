# WHERE TO FIND THE MIGRATION FILE

## 📍 Location in Your Repository

The migration file is located at:
```
supabase/migrations/20260203_create_chat_tables.sql
```

## 🔍 How to Access It

### Option 1: From GitHub (Easiest)
1. Go to your repository on GitHub
2. Navigate to: `supabase` → `migrations` → `20260203_create_chat_tables.sql`
3. Click "Raw" button
4. Copy all the text (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor

### Option 2: From Local Clone
If you have the repo cloned locally:
```bash
# View the file
cat supabase/migrations/20260203_create_chat_tables.sql

# Copy to clipboard (macOS)
cat supabase/migrations/20260203_create_chat_tables.sql | pbcopy

# Copy to clipboard (Linux)
cat supabase/migrations/20260203_create_chat_tables.sql | xclip -selection clipboard
```

### Option 3: Direct Link
If viewing on GitHub, the direct link is:
```
https://github.com/Tksagake/vivacelib2/blob/copilot/implement-contextual-ai-tutor/supabase/migrations/20260203_create_chat_tables.sql
```

## 📝 What This File Contains

The migration creates:

### 1. Three Tables
```sql
✓ chat_threads
  - Stores conversation threads
  - Fields: id, user_id, title, model, status, created_at, updated_at
  
✓ chat_messages
  - Stores individual messages
  - Fields: id, thread_id, role, content, sequence, created_at
  
✓ chat_uploads
  - Stores file upload metadata
  - Fields: id, thread_id, user_id, storage_path, file_name, mime_type, 
           extracted_text, extraction_status, created_at
```

### 2. Indexes (for performance)
```sql
✓ idx_chat_threads_user - Fast user thread lookups
✓ idx_chat_messages_thread - Fast message retrieval
✓ idx_chat_uploads_thread - Fast upload queries
```

### 3. Storage Bucket
```sql
✓ chat-uploads bucket (private)
```

### 4. RLS Policies (security)
```sql
✓ Users can only see their own threads
✓ Users can only see messages in their threads
✓ Users can only see their own uploads
✓ Storage policies enforce user-specific file access
```

## ⚡ Quick Copy-Paste

Here's the first few lines so you can verify you have the right file:

```sql
-- Create chat_threads table
create table public.chat_threads (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,

  title text null,
  model text not null default 'deepseek-chat',
  status text not null default 'active'
    check (status in ('active', 'archived')),

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint chat_threads_pkey primary key (id)
);
```

If your file starts with these lines, you have the correct migration! ✅

## 🎯 Steps to Run

1. Open file in your repo: `supabase/migrations/20260203_create_chat_tables.sql`
2. Copy ENTIRE contents (about 130 lines)
3. Go to Supabase Dashboard → SQL Editor
4. Paste the contents
5. Click "Run"
6. Wait for "Success" message

## ✅ Verification

After running, check in Supabase Table Editor:
- ✓ `chat_threads` table should exist
- ✓ `chat_messages` table should exist
- ✓ `chat_uploads` table should exist

Each table should have:
- Proper columns
- Primary keys
- Indexes
- RLS policies enabled

## ⚠️ Common Mistakes

❌ **Don't** run only part of the file
   → Must copy ENTIRE file (all 130+ lines)

❌ **Don't** modify the SQL
   → Run it exactly as-is

❌ **Don't** run it multiple times
   → Run once, verify tables exist, done

❌ **Don't** skip the storage bucket
   → Also create `chat-uploads` bucket in Storage section

## 💡 Pro Tip

You can verify the migration was successful by running this query in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_threads', 'chat_messages', 'chat_uploads');
```

Should return 3 rows! ✅

---

**Need Help?** See `QUICKFIX_DATABASE.md` for complete step-by-step instructions!
