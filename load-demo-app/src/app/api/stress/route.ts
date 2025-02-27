import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phase } = await request.json();
    
    // For now, let's just log and return the phase
    console.log(`Stress test phase: ${phase}`);
    
    return NextResponse.json({ success: true, phase });
  } catch (error) {
    console.error('Error in stress API:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
} 