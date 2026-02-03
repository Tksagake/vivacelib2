# QUICK FIX: Database Tables Missing

## You're seeing this error because the database tables don't exist yet!

### ⚠️ ERROR: "relation 'chat_threads' does not exist"

This means you have **NOT** run the database migration yet. Follow these steps:

## 🔧 FIX IN 5 MINUTES

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run the Migration
1. In SQL Editor, click "New query"
2. Open this file in your repository: `supabase/migrations/20260203_create_chat_tables.sql`
3. Copy the **ENTIRE** contents of that file
4. Paste into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Wait for "Success" message

### Step 3: Verify Tables Were Created
1. In Supabase Dashboard, go to "Table Editor" (left sidebar)
2. You should now see these 3 tables:
   - ✅ `chat_threads`
   - ✅ `chat_messages`
   - ✅ `chat_uploads`

### Step 4: Create Storage Bucket
1. In Supabase Dashboard, go to "Storage"
2. Click "Create a new bucket"
3. Name it: `chat-uploads`
4. Make sure it's set to **Private** (not public)
5. Click "Create bucket"

### Step 5: Test Your App
1. Refresh your application
2. Try using the chat feature
3. It should work now! 🎉

## 🔍 How to Verify It's Fixed

Visit these URLs to check status:
- `/api/status` - Should return "ok"
- `/api/health-check` - Should return "healthy"

If health-check still returns 404:
1. Redeploy your application on Vercel
2. Clear browser cache
3. Try again

## 📋 What the Migration Does

The migration creates:
1. **Tables**: chat_threads, chat_messages, chat_uploads
2. **Indexes**: For fast queries
3. **RLS Policies**: Security rules
4. **Storage Bucket**: For file uploads

## ❓ Still Not Working?

### Error: "access denied" or "permission denied"
- Make sure you're logged in to your app
- Check that RLS policies were created (they're in the migration)

### Error: "Failed to fetch"
- Check internet connection
- Verify Supabase project is active
- Confirm environment variables are set in Vercel

### Error: 404 on /api/health-check
- Redeploy your application
- Clear CDN cache in Vercel
- The endpoint might not be deployed yet

### Error: Still getting 500 errors
1. Check Vercel function logs for detailed error
2. Verify all environment variables are set
3. Make sure you ran the migration completely
4. Check Supabase logs for RLS policy errors

## 💡 Pro Tip

You can check the exact SQL that was run by going to:
- Supabase Dashboard → Database → Query History
- Look for recent CREATE TABLE statements

## 🆘 Need More Help?

See these files in the repository:
- `TROUBLESHOOTING.md` - Common issues
- `ERROR_RESOLUTION_GUIDE.md` - Detailed troubleshooting
- `AI_TUTOR_SETUP.md` - Complete setup guide

## ⚡ Quick Test Commands

```bash
# Test API is running
curl https://your-app.vercel.app/api/status

# Test health check
curl https://your-app.vercel.app/api/health-check

# Check for database tables
# (This will fail if tables don't exist - that's expected!)
curl https://your-app.vercel.app/api/chat-threads?userId=test
```

---

**Remember:** The migration MUST be run in your Supabase project's SQL Editor. It cannot be run automatically from Vercel!
