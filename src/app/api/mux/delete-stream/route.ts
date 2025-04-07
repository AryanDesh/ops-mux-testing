import { NextRequest, NextResponse } from 'next/server';
import mux from '@/libs/muxUtils';

export async function POST(req: NextRequest) {
  const streamId = req.nextUrl.searchParams.get('streamId');
  if (!streamId) return NextResponse.json({ error: 'Missing streamId' }, { status: 400 });

  const stream = await mux.video.liveStreams.delete(streamId);
  return NextResponse.json({ deletedStream : stream});
}
