'use client';

import { useEffect, useState } from 'react';
import StreamSender from '@/components/StreamSender';

export default function Home() {
  const [streamId, setStreamId] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  useEffect(() => {
    if (!streamId) return;
    console.log(streamId)

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mux/status?streamId=${streamId}`);
        const data = await res.json();
        console.log(data);
        if (data?.isActive) {
          setIsStreamActive(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error polling stream status:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [streamId]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🎥 Live Stream to Mux</h1>

      <StreamSenderWrapper onStreamId={(id) => setStreamId(id)} />

      {streamId && !isStreamActive && (
        <p style={{ marginTop: '1rem', color: 'orange' }}>⏳ Waiting for stream to become active...</p>
      )}

      {isStreamActive && (
        <p style={{ marginTop: '1rem', color: 'green' }}>✅ Stream is LIVE!</p>
      )}
    </main>
  );
}

function StreamSenderWrapper({ onStreamId }: { onStreamId: (id: string) => void }) {
  const [playbackId, setPlaybackId] = useState('');
  const [streamId, setStreamId] = useState('');

  useEffect(() => {
    if (streamId) {
      onStreamId(streamId);
      console.log("Stream Sender" , streamId);
    }
  }, [streamId]);

  return (
    <StreamSenderCapture
      onCapture={(data) => {
        if (data.streamId) setStreamId(data.streamId);
        if (data.playbackId) setPlaybackId(data.playbackId);
      }}
    />
  );
}

function StreamSenderCapture({
  onCapture,
}: {
  onCapture: (data: { playbackId: string; streamId: string }) => void;
}) {
  const [playbackId, setPlaybackId] = useState('');
  const [streamId, setStreamId] = useState('');

  useEffect(() => {
    if (playbackId && streamId) {
      onCapture({ playbackId, streamId });
    }
  }, [playbackId, streamId]);

  return (
    <StreamSender
      key="sender" 
    />
  );
}
