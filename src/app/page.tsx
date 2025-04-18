'use client';
import { useEffect, useRef, useState } from 'react';
import { useStreamListener } from '@/hooks/useStreamListener';
import StreamPlayer from '@/components/StreamPlayer';
import { io, Socket } from 'socket.io-client';

export default function Home() {
  const [formData, setFormData] = useState({ 
    video_creator_id: 642,
    channel_id: 292,
    title: 'title2',
    description: 'desc2',
    categories: ['3', '5'],
    allow_comments: true,
    allow_watch_comments: true,
    access_type: 'free',
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [streamInfo, setStreamInfo] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [playbackId, setPlaybackId] = useState('');
  const [stream_id, setStream_id] = useState('');
  const [streamKey, setStreamKey] = useState('');

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async () => {
    setShowFormModal(false);

    socketRef.current = io('http://localhost:3002', {
      auth: { ...formData }
    });

    socketRef.current.on('connect', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
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
    });

    socketRef.current.on('message', (msg: string) => {
      const { playbackId, streamId, streamKey, video_id, video_title, access_type } = JSON.parse(msg);
      setPlaybackId(playbackId);
      setStream_id(streamId);
      setStreamKey(streamKey);
    });
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🎥 Go Live</h1>

      <button onClick={() => setShowFormModal(true)}>Start Streaming</button>

      {/* Video preview */}
      <div style={{ marginTop: 20 }}>
        <video
          ref={videoPreviewRef}
          style={{ width: '60%', borderRadius: 8 }}
          muted
          autoPlay
          playsInline
        />
      </div>

      {/* Mux stream info */}
      {playbackId && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Stream ID:</strong> {stream_id}</p>
          <p><strong>Playback ID:</strong> {playbackId}</p>
          <p><strong>Stream Key:</strong> {streamKey}</p>
          <p>Waiting for your stream to go live...</p>
        </div>
      )}

      {playbackId && stream_id && isLive && (
        <StreamPlayer playbackId={playbackId} streamId={stream_id} />
      )}

      {/* Modal form */}
      {showFormModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'maroon', padding: 20, borderRadius: 8,
            width: 500, maxWidth: '90%'
          }}>
            <h2>Enter Stream Details</h2>
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', marginBottom: 10 }} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', marginBottom: 10 }} />

            <label>
              <input type="checkbox" name="allowComments" checked={formData.allow_comments} onChange={handleInputChange} /> Allow Watchers to Comment
            </label><br />
            <label>
              <input type="checkbox" name="showComments" checked={formData.allow_watch_comments} onChange={handleInputChange} /> Allow Watchers to See Comments
            </label><br /><br />

            <label>
              <input type="radio" name="type" value="free" checked={formData.access_type === 'free'} onChange={handleInputChange} /> Free
            </label>
            <label style={{ marginLeft: 10 }}>
              <input type="radio" name="type" value="paid" checked={formData.access_type === 'paid'} onChange={handleInputChange} /> Paid
            </label>
            <label style={{ marginLeft: 10 }}>
              <input type="radio" name="type" value="member" checked={formData.access_type === 'member'} onChange={handleInputChange} /> Members Only
            </label>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleFormSubmit}>Go Live</button>
              <button onClick={() => setShowFormModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
