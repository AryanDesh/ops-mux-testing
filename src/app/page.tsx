'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/socketContext';

export default function Home() {
  const router = useRouter();
  const {socket , connect, disconnect} = useSocket();

  const [formData, setFormData] = useState({
    video_creator_id: 642,
    channel_id: 292,
    title: '',
    description: '',
    categories: ['3', '5'],
    allow_comments: true,
    allow_watch_comments: true,
    access_type: 'free',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  

  const handleGoLive = async () => {
    setIsSubmitting(true);
  
    try {
      const connectedSocket = await connect(); 
      console.log('Connected socket:', connectedSocket);
  
      connectedSocket.emit('init-live', formData);
      connectedSocket.once('live-init-response', (data) => {
        if (data.status === 'error') {
          console.error('Stream init failed:', data.message);
          alert('Failed to start live stream: ' + data.message);
          setIsSubmitting(false);
          return;
        }
              
        const {
          streamId,
          playbackId,
          streamKey,
          video_id,
          video_title,
          access_type,
        } = data;
      
        router.push(`/video/${video_id}`);
      });
      
    } catch (err) {
      console.error('Failed to connect socket:', err);
    }
  };
    return (
    <div style={{ padding: 30 }}>
      <h1>🎥 Create Live Stream</h1>

      <div style={{
        backgroundColor: 'maroon',
        padding: 20,
        borderRadius: 8,
        width: 500,
        maxWidth: '90%',
        color: 'white',
        fontFamily: 'Arial'
      }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />

        <label>
          <input
            type="checkbox"
            name="allow_comments"
            checked={formData.allow_comments}
            onChange={handleInputChange}
          /> Allow Watchers to Comment
        </label><br />
        <label>
          <input
            type="checkbox"
            name="allow_watch_comments"
            checked={formData.allow_watch_comments}
            onChange={handleInputChange}
          /> Allow Watchers to See Comments
        </label><br /><br />

        <label>
          <input
            type="radio"
            name="access_type"
            value="free"
            checked={formData.access_type === 'free'}
            onChange={handleInputChange}
          /> Free
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="access_type"
            value="paid"
            checked={formData.access_type === 'paid'}
            onChange={handleInputChange}
          /> Paid
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="access_type"
            value="member"
            checked={formData.access_type === 'member'}
            onChange={handleInputChange}
          /> Members Only
        </label>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleGoLive} disabled={isSubmitting}>
            {isSubmitting ? 'Connecting...' : 'Go Live'}
          </button>
        </div>
      </div>
    </div>
  );
}
