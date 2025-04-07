'use client';

import { useEffect, useState } from 'react';
export default function Home() {
  const [streamKey, setStreamKey] = useState('');
  const [playbackId, setPlaybackId] = useState('');
  const [streamId, setStreamId] = useState('');
  const [streamActive, setStreamActive] = useState(false);
  const [polling, setPolling] = useState(false);

  const handleCreateStream = async () => {
    const res = await fetch('/api/mux/create-stream', { method: 'POST' });
    const data = await res.json();
    setStreamKey(data.streamKey);
    setPlaybackId(data.playbackId);
    setStreamId(data.streamId);
    setPolling(true);
  };

  const handleDeleteStream = async () => {
    const res = await fetch('/api/mux/delete-stream', {method : 'POST'});
    console.log(res.json());
    setStreamKey('');
    setPlaybackId('');
    setStreamId('');
    setStreamActive(false);
    setPolling(false);
  }

  useEffect(() => {
    if (!polling || !streamId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/mux/stream-status?streamId=${streamId}`);
      const data = await res.json();
      console.log('Polling:', data);
      if (data.isActive == 'active') {
        console.log("In is active")
        setStreamActive(true);
        setPolling(false);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [polling, streamId]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mux RTMP Stream Test</h1>
      <button
        onClick={handleCreateStream}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Stream
      </button>

      <button
        onClick={handleDeleteStream}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Delete Stream
      </button>


      {streamKey && (
        <div className="mt-4 space-y-2">
          <p><strong>Stream Key:</strong> {streamKey}</p>
          <p><strong>RTMP URL:</strong> rtmp://global-live.mux.com:5222/app</p>
          <p><strong>Playback ID:</strong> {playbackId}</p>
        </div>
      )}

      {streamActive && playbackId && (
        <div className="mt-6">
          <mux-player
            playback-id={playbackId}
            metadata-video-title="Test Stream"
            metadata-viewer-user-id="user-id-007"
            stream-type="live"
            style={{ width: '100%', maxWidth: '640px', height: '360px' }}
          />
        </div>
      )}
    </main>
  );
}
