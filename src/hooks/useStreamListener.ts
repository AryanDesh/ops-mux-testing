import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export const useStreamListener = (
  streamId: string,
  onLive: () => void,
  socket?: Socket | null
) => {
  useEffect(() => {
    console.log('Checking for active')
    if (!socket || !streamId) return;
    const handleStreamActive = (data: { message: string; streamId: string }) => {
      if (data.streamId === streamId) {
        console.log(`🔴 Stream is now LIVE: ${data.message}`);
        onLive();
      }
    };

    socket.on('stream_active', handleStreamActive);

    return () => {
      socket.off('stream_active', handleStreamActive);
    };
  }, [socket, streamId, onLive]);
};
