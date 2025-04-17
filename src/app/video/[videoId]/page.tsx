'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/context/socketContext';

export default function VideoPage() {
  const { videoId } = useParams();
  const { socket, connect, disconnect } = useSocket();

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [streamInfo, setStreamInfo] = useState<any>(null);

  useEffect(() => {
    let localStream: MediaStream;
  
    const startStream = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = localStream;
      }
  
      mediaRecorderRef.current = new MediaRecorder(localStream, {
        mimeType: 'video/webm; codecs=vp8,opus',
      });
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then((buffer) => {
            socket?.emit('message', buffer);
          });
        }
      };
  
      
      mediaRecorderRef.current.start(2000);
    };
  
    startStream();
  
    return () => {
      mediaRecorderRef.current?.stop();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  

  return (
    <div>
      <h2>Streaming Now - Video ID: {videoId}</h2>
      <video ref={videoPreviewRef} muted autoPlay playsInline style={{ width: '60%' }} />
    </div>
  );
}
