#!/bin/bash

# Simple test script to verify AI Tutor system components

echo "=== AI Tutor System - Component Verification ==="
echo ""

# Check if required files exist
echo "1. Checking Database Schema..."
if [ -f "supabase/migrations/20260203_create_chat_tables.sql" ]; then
    echo "   ✓ Database migration file exists"
else
    echo "   ✗ Database migration file missing"
fi

echo ""
echo "2. Checking API Routes..."
api_routes=(
    "app/api/chat-threads/route.ts"
    "app/api/chat-messages/route.ts"
    "app/api/chat-upload/route.ts"
    "app/api/deepseek-chat/route.ts"
)

for route in "${api_routes[@]}"; do
    if [ -f "$route" ]; then
        echo "   ✓ $route exists"
    else
        echo "   ✗ $route missing"
    fi
done

echo ""
echo "3. Checking Updated Chat Page..."
if [ -f "app/chat/page.tsx" ]; then
    if grep -q "chat_threads" "app/chat/page.tsx"; then
        echo "   ✓ Chat page updated to use new schema"
    else
        echo "   ✗ Chat page not updated"
    fi
else
    echo "   ✗ Chat page missing"
fi

echo ""
echo "4. Checking Dependencies..."
if grep -q "pdf-parse" "package.json" && grep -q "tesseract.js" "package.json"; then
    echo "   ✓ Text extraction libraries installed"
else
    echo "   ✗ Text extraction libraries missing"
fi

echo ""
echo "5. Checking Academic Scope Enforcement..."
if grep -q "music-related academic topics" "app/api/deepseek-chat/route.ts"; then
    echo "   ✓ Academic scope system prompt present"
else
    echo "   ✗ Academic scope system prompt missing"
fi

echo ""
echo "6. Checking File Upload Configuration..."
if grep -q "ALLOWED_MIME_TYPES.*pdf.*png.*jpeg" "app/api/chat-upload/route.ts"; then
    echo "   ✓ File type restrictions configured"
else
    echo "   ✗ File type restrictions not found"
fi

echo ""
echo "7. Build Status..."
if [ -d ".next" ]; then
    echo "   ✓ Project built successfully"
else
    echo "   ℹ Project not built yet (run 'npm run build')"
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Set up environment variables in .env.local"
echo "2. Run database migration in Supabase"
echo "3. Test file uploads and text extraction"
echo "4. Verify academic scope enforcement"
echo ""
echo "See AI_TUTOR_SETUP.md for detailed setup instructions"
