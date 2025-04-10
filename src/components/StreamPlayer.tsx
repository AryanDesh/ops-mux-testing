'use client';
import { useEffect, useState } from 'react';

interface StreamStatus {
  status: string;
  isActive: boolean;
}

export default function StreamPlayer({ playbackId, streamId }: { playbackId: string, streamId: string }) {
  const [status, setStatus] = useState<StreamStatus | null>(null);

  return (
    <div className="mt-6">
      <p><strong>Stream Status:</strong> {status?.status || 'Loading...'}</p>
      {isLive && (
        <mux-player
          playback-id={playbackId}
          metadata-video-title="Test Stream"
          metadata-viewer-user-id="user-id-007"
          stream-type="live"
          style={{ width: '100%', maxWidth: '640px', height: '360px' }}
        />
      )}
    </div>
  );
}
