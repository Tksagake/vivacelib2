# FIXING: Invalid API Key Error

## 🔴 Error Message
```
{error: 'Failed to fetch threads', details: 'Invalid API key', hint: 'Check if chat_threads table exists in database'}
```

## ✅ Your Database is Fine!
Your database tables exist correctly. The issue is with your **Supabase API keys** in Vercel.

## 🎯 Root Cause
The error "Invalid API key" from Supabase means one of these issues:

1. **Extra spaces or quotes** around your API key in Vercel
2. **Incomplete API key** - didn't copy the full key
3. **Wrong project** - using keys from a different Supabase project
4. **Malformed key** - special characters not handled correctly

## 🔧 How to Fix (5 Minutes)

### Step 1: Get Fresh Keys from Supabase

1. Go to https://app.supabase.com
2. Select **YOUR** project (make sure it's the right one!)
3. Click **Settings** → **API** (in left sidebar)
4. You'll see two important keys:

#### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
**Copy this exactly** - this is your `NEXT_PUBLIC_SUPABASE_URL`

#### API Keys
You'll see:
- `anon` `public` - This is your **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- `service_role` `secret` - This is your **SUPABASE_SERVICE_ROLE_KEY**

**Important:** 
- Both keys should start with `eyJ`
- Both keys are VERY LONG (100+ characters)
- Click the "Copy" button - don't manually select text

### Step 2: Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project: `vivacelib2`
3. Go to **Settings** → **Environment Variables**
4. **Delete** all existing Supabase variables
5. **Add new ones** following these rules:

#### Add NEXT_PUBLIC_SUPABASE_URL
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxxxxxxxxxxxx.supabase.co` (your project URL)
- **NO** quotes around it
- **NO** spaces before or after
- Environment: Check **all three** (Production, Preview, Development)

#### Add NEXT_PUBLIC_SUPABASE_ANON_KEY
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGc...` (paste the full anon public key)
- **NO** quotes around it
- **NO** spaces before or after
- Environment: Check **all three** (Production, Preview, Development)

#### Add SUPABASE_SERVICE_ROLE_KEY (Recommended)
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGc...` (paste the full service_role secret key)
- **NO** quotes around it
- **NO** spaces before or after
- Environment: Check **all three** (Production, Preview, Development)

### Step 3: Verify Your Keys

Before saving, verify:
- [ ] Keys start with `eyJ`
- [ ] Keys are very long (100+ characters)
- [ ] No spaces at start or end
- [ ] No quotes around the keys
- [ ] URL matches your Supabase project

### Step 4: Redeploy

1. After adding all keys, click **Save**
2. Go to **Deployments** tab
3. Find latest deployment
4. Click **...** menu → **Redeploy**
5. Wait for deployment to complete

### Step 5: Clear Cache and Test

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Close all tabs with your app
3. Open fresh tab
4. Navigate to your app
5. Try using the chat
6. Should work now! 🎉

## ⚠️ Common Mistakes

### ❌ Wrong: Adding Quotes
```
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
```
**Correct:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### ❌ Wrong: Extra Spaces
```
NEXT_PUBLIC_SUPABASE_URL= https://xxx.supabase.co 
```
**Correct:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

### ❌ Wrong: Incomplete Key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
(key gets cut off)
```
**Correct:** Use Copy button, paste entire key

### ❌ Wrong: Keys from Different Project
Using keys from Project A with URL from Project B
**Correct:** All keys and URL must be from same project

## 🔍 How to Verify It's Fixed

### Test the Status Endpoint
```bash
curl https://your-app.vercel.app/api/status
```
Should return:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Test the Health Check
```bash
curl https://your-app.vercel.app/api/health-check
```
Should return:
```json
{
  "overall": "healthy",
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "supabaseServiceKey": true
  },
  "database": {
    "canConnect": true,
    "tables": {
      "chat_threads": true,
      "chat_messages": true,
      "chat_uploads": true
    }
  }
}
```

If you still see `"Invalid API key"`, your keys are still wrong!

## 🆘 Still Not Working?

### Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Deployments**
4. Click latest deployment
5. Click **Functions** tab
6. Look for errors in `/api/chat-threads`

### Verify Keys in Supabase
1. Make sure you're in the correct Supabase project
2. Check if project is active (not paused)
3. Verify API settings haven't changed
4. Try regenerating the keys if needed

### Check for Typos
1. Copy keys again from Supabase
2. Delete and re-add in Vercel
3. Triple-check no extra characters
4. Make sure you selected all three environments

## 💡 Pro Tips

1. **Use Service Role Key**: It bypasses RLS policies and is more reliable for server-side operations
2. **Copy-Paste Only**: Never type keys manually
3. **Check Both Projects**: Make sure URL and keys match
4. **Test Locally First**: Set up `.env.local` file to test before deploying
5. **One Environment at a Time**: Set Production first, test, then add Preview/Development

## 📝 Example .env.local for Local Testing

Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEEPSEEK_API_KEY=sk-...
```

Then test locally:
```bash
npm run dev
```

Visit http://localhost:3000 and try the chat.

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ No more "Invalid API key" errors
- ✅ `/api/health-check` returns "healthy"
- ✅ Chat interface loads without errors
- ✅ You can create new conversations
- ✅ Messages are saved and retrieved

---

**Remember:** The issue is NOT with your database. Your tables exist. The issue is ONLY with the API keys in Vercel environment variables!
