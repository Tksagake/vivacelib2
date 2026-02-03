import { NextResponse } from 'next/server';

// Simple status endpoint that always works
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API is running',
    nextSteps: [
      '1. If you see this, your API routes are working',
      '2. Check if database tables exist by visiting /api/health-check',
      '3. If health-check returns 404, redeploy your application',
      '4. If you get database errors, run the migration in Supabase SQL Editor'
    ]
  });
}
