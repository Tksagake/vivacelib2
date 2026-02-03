# Chat Error Resolution Guide

## Understanding the 500 Error

When you see these errors:
```
GET /api/chat-threads?userId=... - 500 Internal Server Error
POST /api/chat-threads - 500 Internal Server Error
```

It means the server is failing to process your request. Here's what's happening:

## Error Flow Diagram

```
User tries to chat
     ↓
Chat page loads → Gets userId from auth
     ↓
Calls: GET /api/chat-threads?userId=...
     ↓
API checks: Is Supabase configured?
     ├─ NO → 500 Error: "Supabase configuration missing"
     └─ YES → Continue
          ↓
     Tries to query database: chat_threads table
          ├─ Table doesn't exist → 500 Error: "relation 'chat_threads' does not exist"
          ├─ RLS policy blocks → 500 Error: "access denied"
          └─ Success → Returns threads
```

## Root Causes & Solutions

### 🔴 Cause 1: Environment Variables Not Set

**How to detect:**
- Health check shows: `"supabaseUrl": false` or `"supabaseAnonKey": false`
- Error message: "Supabase configuration missing"

**Solution:**
```bash
# In Vercel Dashboard:
# Settings → Environment Variables → Add:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_key
DEEPSEEK_API_KEY=sk-...your_deepseek_key
```

Then **redeploy** the application!

### 🔴 Cause 2: Database Tables Don't Exist

**How to detect:**
- Health check shows: `"chat_threads": false` in tables section
- Error contains: "relation does not exist" or "table not found"

**Solution:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this migration:
```sql
-- Copy the entire contents of:
-- supabase/migrations/20260203_create_chat_tables.sql

-- Then paste and run in SQL Editor
```

### 🔴 Cause 3: RLS Policies Not Configured

**How to detect:**
- Tables exist but still get errors
- Error contains: "access denied" or "RLS policy"

**Solution:**
The migration SQL includes RLS policies. Re-run the migration to ensure they're created.

## Diagnostic Tools

### 1. Health Check Endpoint

```bash
# Check system health
curl https://your-app.vercel.app/api/health-check

# or visit in browser:
https://your-app.vercel.app/api/health-check
```

**Response Examples:**

❌ **Unhealthy** (Environment variables missing):
```json
{
  "overall": "unhealthy",
  "environment": {
    "supabaseUrl": false,
    "supabaseAnonKey": false
  },
  "database": {
    "canConnect": false,
    "errors": ["Supabase credentials not configured"]
  }
}
```

⚠️ **Degraded** (Tables missing):
```json
{
  "overall": "degraded",
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true
  },
  "database": {
    "canConnect": true,
    "tables": {
      "chat_threads": false,
      "chat_messages": false,
      "chat_uploads": false
    },
    "errors": [
      "chat_threads: relation \"public.chat_threads\" does not exist"
    ]
  }
}
```

✅ **Healthy** (Everything working):
```json
{
  "overall": "healthy",
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "supabaseServiceKey": true,
    "deepseekApiKey": true
  },
  "database": {
    "canConnect": true,
    "tables": {
      "chat_threads": true,
      "chat_messages": true,
      "chat_uploads": true
    },
    "errors": []
  }
}
```

### 2. Browser Console

Open DevTools (F12) and check:

**Console Tab:**
```
Error fetching threads: {...}
Supabase not configured. Check environment variables:
NEXT_PUBLIC_SUPABASE_URL: Missing
NEXT_PUBLIC_SUPABASE_ANON_KEY: Missing
```

**Network Tab:**
- Find the failed request
- Click on it
- Check "Response" tab for detailed error

### 3. Vercel Function Logs

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments"
4. Click latest deployment
5. Click "Functions" or "Logs"
6. Look for errors from `/api/chat-threads`

## Step-by-Step Fix Guide

### Step 1: Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create one)
3. Go to Settings → API
4. Copy these values:
   - **URL** (Project URL) → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste your URL)
   - Environment: Check all (Production, Preview, Development)
6. Repeat for all variables

### Step 3: Run Database Migration

1. In Supabase Dashboard, go to SQL Editor
2. Open a new query
3. Copy entire contents of `supabase/migrations/20260203_create_chat_tables.sql`
4. Paste into SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Wait for "Success" message

### Step 4: Create Storage Bucket

1. In Supabase Dashboard, go to Storage
2. Click "Create a new bucket"
3. Name: `chat-uploads`
4. Public: **NO** (keep private)
5. File size limit: 10MB
6. Click "Create bucket"

### Step 5: Redeploy Application

1. In Vercel Dashboard, go to Deployments
2. Find latest deployment
3. Click "..." menu
4. Select "Redeploy"
5. Wait for deployment to complete

### Step 6: Verify Setup

1. Visit: `https://your-app.vercel.app/api/health-check`
2. Check response shows `"overall": "healthy"`
3. Try using the chat feature
4. Should work now! 🎉

## Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Supabase configuration missing" | Env vars not set | Add environment variables in Vercel |
| "relation 'chat_threads' does not exist" | Tables not created | Run database migration |
| "Failed to fetch threads" | Network or auth issue | Check Supabase connection |
| "Thread not found or access denied" | RLS policy issue | Verify user is authenticated |
| "Access denied" | RLS blocking query | Check RLS policies in migration |

## Still Having Issues?

1. Run health check: `/api/health-check`
2. Check Vercel function logs
3. Verify Supabase project is active
4. Try the "Temporary Debug" section in TROUBLESHOOTING.md
5. Ensure all environment variables are set for **all environments** (Production, Preview, Development)

## Quick Checklist

Before asking for help, verify:

- [ ] Supabase project created and active
- [ ] Environment variables added to Vercel
- [ ] Database migration executed successfully
- [ ] Tables visible in Supabase Table Editor
- [ ] Storage bucket "chat-uploads" created
- [ ] Application redeployed after adding env vars
- [ ] Health check endpoint returns "healthy"
- [ ] User is logged in (for RLS policies)

## Contact

If you've completed all steps and still have issues:
1. Share the output from `/api/health-check`
2. Share any error messages from browser console
3. Share Vercel function logs for `/api/chat-threads`

This will help diagnose the specific issue!
