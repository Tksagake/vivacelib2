# Vercel Environment Variables Setup Guide

## Your Question: "what should the .env look like when i update it in vercel?"

### Important: Vercel Doesn't Use .env Files!

In Vercel, you don't edit a `.env` file. Instead, you add **environment variables** through the Vercel Dashboard UI.

---

## Quick Start

### Required Environment Variables (4 total):

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key (client-side)
3. `SUPABASE_SERVICE_ROLE_KEY` - Secret API key (server-side) ⚠️
4. `DEEPSEEK_API_KEY` - DeepSeek AI API key

---

## Step 1: Get Your Values

### From Supabase (Project: bzqbqcapzeagkbrpmuow)

1. Go to: https://app.supabase.com
2. Select your project: **bzqbqcapzeagkbrpmuow**
3. Navigate to: **Settings** → **API**
4. You'll see:
   - **Project URL**: `https://bzqbqcapzeagkbrpmuow.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Click Copy)
   - **service_role** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Click Copy - This is secret!)

### From DeepSeek

1. Go to: https://platform.deepseek.com
2. Navigate to: **API Keys**
3. Copy your API key: `sk-...`

---

## Step 2: Add To Vercel

### Navigate to Environment Variables:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click: **Settings** → **Environment Variables**

### Add Each Variable (NO QUOTES!):

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://bzqbqcapzeagkbrpmuow.supabase.co
       ↑ Paste WITHOUT quotes
Environment: All (Production, Preview, Development)
```

Click **Save**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
       ↑ Paste the FULL key WITHOUT quotes
Environment: All (Production, Preview, Development)
```

Click **Save**

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY ⚠️ IMPORTANT!

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
       ↑ Paste the FULL key WITHOUT quotes
Environment: All (Production, Preview, Development)
```

**⚠️ This is your specific fix!** Make sure this key is from project **bzqbqcapzeagkbrpmuow**!

Click **Save**

#### Variable 4: DEEPSEEK_API_KEY

```
Key: DEEPSEEK_API_KEY
Value: sk-...
       ↑ Paste WITHOUT quotes
Environment: All (Production, Preview, Development)
```

Click **Save**

---

## Step 3: Redeploy

After adding/updating environment variables:

1. Go to: **Deployments** tab
2. Find the latest deployment
3. Click the **[...]** (three dots) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

**Important:** Environment variable changes only take effect after redeployment!

---

## Step 4: Verify

### Test Your Configuration:

```bash
curl https://your-app.vercel.app/api/test-supabase
```

**Expected Result:**
```json
{
  "anon_key_test": {
    "status": "passed",
    "project_id": "bzqbqcapzeagkbrpmuow",
    "matches_url": true
  },
  "service_key_test": {
    "status": "passed",
    "project_id": "bzqbqcapzeagkbrpmuow",
    "matches_url": true
  },
  "diagnosis": "✅ ALL KEYS CORRECT!",
  "result": "Everything works perfectly!"
}
```

### If You See Errors:

- `"status": "failed"` for anon_key_test → Check NEXT_PUBLIC_SUPABASE_ANON_KEY
- `"status": "failed"` for service_key_test → Check SUPABASE_SERVICE_ROLE_KEY
- `"matches_url": false` → Keys are from different project than URL

---

## Common Mistakes To Avoid

### ❌ Mistake #1: Adding Quotes

**Wrong:**
```
Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
       ↑ Don't add quotes!
```

**Correct:**
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
       ↑ No quotes
```

### ❌ Mistake #2: Extra Spaces

**Wrong:**
```
Value:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... 
       ↑ space                                  ↑ space
```

**Correct:**
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ Mistake #3: Using Keys From Wrong Project

**Wrong:**
```
URL: https://bzqbqcapzeagkbrpmuow.supabase.co (Project A)
Keys: From different-project-id (Project B)
```

**Correct:**
```
URL: https://bzqbqcapzeagkbrpmuow.supabase.co (Project A)
Keys: From bzqbqcapzeagkbrpmuow (Project A)
```

### ❌ Mistake #4: Forgetting To Redeploy

**Wrong:**
```
1. Update environment variables
2. Don't redeploy
3. Variables not active! ❌
```

**Correct:**
```
1. Update environment variables
2. Redeploy immediately ✅
3. Variables now active! ✅
```

---

## Your Specific Fix

### Problem:
Your `SUPABASE_SERVICE_ROLE_KEY` is from a different project or is invalid.

### Solution (2 minutes):

1. **Get Correct Key:**
   - Go to https://app.supabase.com
   - Open project: **bzqbqcapzeagkbrpmuow** (check the URL!)
   - Settings → API
   - Copy the **service_role** key (the secret one, not anon!)

2. **Update In Vercel:**
   - Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Find: `SUPABASE_SERVICE_ROLE_KEY`
   - Click **Edit** (pencil icon)
   - Paste the new value (NO QUOTES!)
   - Click **Save**

3. **Redeploy:**
   - Deployments tab
   - Latest deployment → [...] menu
   - Click **Redeploy**
   - Wait 2-3 minutes

4. **Verify:**
   ```bash
   curl https://your-app.vercel.app/api/test-supabase
   ```
   Should now show: `"service_key_test": { "status": "passed" }`

**Done! ✅**

---

## Validation Checklist

### Before Redeploying:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- [ ] URL contains `bzqbqcapzeagkbrpmuow`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` starts with `eyJ`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` starts with `eyJ`
- [ ] `DEEPSEEK_API_KEY` starts with `sk-`
- [ ] No quotes around any value
- [ ] No extra spaces before or after values
- [ ] All variables set to "All Environments"
- [ ] All 4 variables present

### After Redeploying:

- [ ] Deployment succeeded (check Deployments tab)
- [ ] Visit `/api/test-supabase`
- [ ] `anon_key_test` shows "passed"
- [ ] `service_key_test` shows "passed"
- [ ] Diagnosis shows "All keys correct!"
- [ ] Login functionality works
- [ ] Chat functionality works
- [ ] No errors in browser console

**All checked? SUCCESS! 🎉**

---

## For Local Development

If you want to run the app locally, create a `.env.local` file:

```bash
# Copy from .env.example in the repository
# Add your actual values

NEXT_PUBLIC_SUPABASE_URL=https://bzqbqcapzeagkbrpmuow.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEEPSEEK_API_KEY=sk-...
```

**Note:** `.env.local` is for local development only. For Vercel (production), use the Dashboard!

---

## Troubleshooting

### Issue: "Invalid API key" Error

**Cause:** SERVICE_ROLE_KEY is from wrong project or malformed

**Fix:**
1. Verify you're copying from project **bzqbqcapzeagkbrpmuow**
2. Copy the **service_role** key (not anon!)
3. Update in Vercel
4. Redeploy

### Issue: Login Works But Chat Fails

**Cause:** ANON key is correct but SERVICE_ROLE_KEY is wrong

**Why:** Login uses ANON key (client-side), Chat uses SERVICE_ROLE key (server-side)

**Fix:** Update SERVICE_ROLE_KEY with correct key from same project

### Issue: Changes Not Taking Effect

**Cause:** Forgot to redeploy

**Fix:**
1. Go to Deployments tab
2. Click [...] on latest deployment
3. Click Redeploy
4. Wait for completion

### Issue: "Could not extract" Project ID

**Cause:** Key is malformed or has extra characters

**Fix:**
1. Copy key again from Supabase (use Copy button!)
2. Paste in Vercel WITHOUT quotes
3. Ensure no spaces before/after
4. Save and redeploy

---

## Summary

### The Answer To Your Question:

**"what should the .env look like when i update it in vercel?"**

**Answer:** Vercel doesn't use .env files! You set environment variables through the Dashboard:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable separately through the UI
3. NO quotes around values
4. Set to "All Environments"
5. Redeploy after changes

### Your Immediate Action:

1. Update `SUPABASE_SERVICE_ROLE_KEY` with correct key
2. From project: **bzqbqcapzeagkbrpmuow**
3. Redeploy
4. Test and succeed! ✅

**Time: 2 minutes**
**Result: Everything works!** 🎉

---

## Need More Help?

- See `VERIFICATION_CHECKLIST.md` for step-by-step verification
- See `WHY_LOGIN_WORKS.md` for understanding the two-key system
- See `DONT_GIVE_UP.md` for encouragement and motivation
- Visit `/api/test-supabase` for diagnostic information

**You've got this!** 💪
