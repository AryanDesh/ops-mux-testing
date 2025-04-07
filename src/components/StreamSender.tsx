'use client';
import { useEffect, useRef, useState } from 'react';
import StreamPlayer from './StreamPlayer';
import { io, Socket } from 'socket.io-client';

export default function StreamSender() {
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [playbackId, setPlaybackId] = useState('');
  const [stream_id, setStream_id] = useState('');

  const startStreaming = async () => {
    socketRef.current = io('http://localhost:3001');
    console.log(socketRef.current)

    socketRef.current.on('connect', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8,opus',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current?.connected) {
          event.data.arrayBuffer().then(buffer => {
            socketRef.current?.emit('message', buffer);
          });
        }
      };

      mediaRecorderRef.current.start(1000); 
      setIsStreaming(true);
    });

    socketRef.current.on('message', (msg: string) => {
      const { playbackId, streamId } = JSON.parse(msg);
      setPlaybackId(playbackId);
      setStream_id(streamId);
    });
  };

  return (
    <div>
      <button onClick={startStreaming} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>

      {playbackId && (
        <StreamPlayer playbackId={playbackId} streamId={stream_id} />
      )}
    </div>
  );
}
