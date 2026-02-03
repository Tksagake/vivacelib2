# Troubleshooting Chat Errors (500 Internal Server Error)

## Common Issues and Solutions

### Issue: "Supabase configuration missing" Error

**Symptoms:**
- 500 error when accessing `/api/chat-threads`
- Console shows: "Supabase not configured"

**Cause:** Environment variables are not set in your deployment (Vercel, etc.)

**Solution:**

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional but recommended)
     DEEPSEEK_API_KEY=your_deepseek_api_key
     ```

2. **Get Your Supabase Credentials:**
   - Log in to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Redeploy Your Application:**
   - After adding environment variables, trigger a new deployment
   - In Vercel: Go to Deployments → Click "..." on latest → Redeploy

### Issue: "Failed to fetch threads" - Table Does Not Exist

**Symptoms:**
- Environment variables are set correctly
- Error message mentions table not found
- Console shows: "relation 'chat_threads' does not exist"

**Cause:** Database migration has not been run

**Solution:**

1. **Run the Database Migration:**
   - Go to Supabase Dashboard
   - Navigate to SQL Editor
   - Open the file: `supabase/migrations/20260203_create_chat_tables.sql`
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run" to execute the migration

2. **Verify Tables Were Created:**
   - In Supabase Dashboard, go to Table Editor
   - You should see three new tables:
     - `chat_threads`
     - `chat_messages`
     - `chat_uploads`

3. **Create the Storage Bucket:**
   - Go to Storage in Supabase Dashboard
   - Create a new bucket named: `chat-uploads`
   - Set it to "Private" (not public)

### Issue: "Access Denied" or RLS Policy Errors

**Symptoms:**
- Tables exist but queries return "access denied"
- "Row level security policy violation" errors

**Cause:** Row Level Security (RLS) policies are blocking access

**Solution:**

1. **Verify User Authentication:**
   - Make sure you're logged in
   - Check that `auth.uid()` returns a valid user ID

2. **Check RLS Policies:**
   - In Supabase Dashboard, go to Authentication → Policies
   - Ensure policies for `chat_threads`, `chat_messages`, and `chat_uploads` exist
   - If missing, re-run the migration SQL file

3. **Temporary Debug (NOT FOR PRODUCTION):**
   - You can temporarily disable RLS for testing:
   ```sql
   -- In Supabase SQL Editor
   ALTER TABLE chat_threads DISABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_uploads DISABLE ROW LEVEL SECURITY;
   ```
   - **IMPORTANT:** Re-enable RLS after debugging

## Health Check Endpoint

Use the health check endpoint to diagnose issues:

```bash
curl https://your-app.vercel.app/api/health-check
```

This will return a JSON response showing:
- Environment variables status
- Database connection status
- Table existence status
- Detailed error messages

Example healthy response:
```json
{
  "timestamp": "2026-02-03T16:00:00.000Z",
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
  },
  "overall": "healthy"
}
```

## Step-by-Step Setup Checklist

- [ ] 1. Create Supabase project
- [ ] 2. Copy Supabase credentials
- [ ] 3. Add environment variables to Vercel
- [ ] 4. Run database migration in Supabase SQL Editor
- [ ] 5. Create `chat-uploads` storage bucket
- [ ] 6. Verify tables exist in Supabase Table Editor
- [ ] 7. Redeploy application
- [ ] 8. Test health check endpoint
- [ ] 9. Try creating a chat thread
- [ ] 10. Send a test message

## Still Having Issues?

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - View "Function Logs" to see detailed error messages

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look at Console tab for error messages
   - Check Network tab for failed API requests

3. **Verify All Prerequisites:**
   - Node.js version compatible
   - All dependencies installed
   - Build succeeded without errors
   - Environment variables set for all environments (Preview, Production)

## Quick Fix Commands

```bash
# Local development - create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
EOF

# Test locally
npm run dev

# Test health check
curl http://localhost:3000/api/health-check
```

## Contact & Support

If you're still experiencing issues after following this guide:
1. Check the detailed logs from `/api/health-check`
2. Review Supabase logs for database errors
3. Verify all environment variables are correctly set
4. Ensure migration was run successfully

For more detailed setup instructions, see `AI_TUTOR_SETUP.md`.
