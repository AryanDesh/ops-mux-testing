import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamId = searchParams.get('streamId');

  if (!streamId) {
    return NextResponse.json({ error: 'Missing streamId' }, { status: 400 });
  }

  try {
    const res = await fetch(`http://localhost:3001/mux/status?streamId=${streamId}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Mux Status API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
