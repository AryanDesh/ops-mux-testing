import { NextRequest, NextResponse } from 'next/server';
import mux from '@/libs/muxUtils';
export async function POST(req: NextRequest) {
  try {
    const liveStream = await mux.video.liveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: { playback_policy: ['public'] },
    });
    console.log(liveStream);
    return NextResponse.json({
      streamKey: liveStream.stream_key,
      playbackId: liveStream.playback_ids?.[0]?.id,
      streamId : liveStream.id
    });
  } catch (err) {
    console.error('Mux error:', err);
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 });
  }
}
