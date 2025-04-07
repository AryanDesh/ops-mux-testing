import { NextRequest, NextResponse } from 'next/server';
import mux from '@/libs/muxUtils';

export async function GET(req: NextRequest) {
  const streamId = req.nextUrl.searchParams.get('streamId');
  if (!streamId) return NextResponse.json({ error: 'Missing streamId' }, { status: 400 });

  const stream = await mux.video.liveStreams.retrieve(streamId);
  return NextResponse.json({ isActive: stream.status });
}
