'use client';
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  connect: () => Promise<Socket>;
  disconnect: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connect: async () => {
    throw new Error('connect function not initialized');
  },
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = useCallback((): Promise<Socket> => {
    return new Promise((resolve) => {
      if (!socketRef.current) {
        const s = io('http://localhost:3002', { autoConnect: false });
        s.connect();
        socketRef.current = s;
        setSocket(s);
        resolve(s);
      } else {
        resolve(socketRef.current);
      }
    });
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
