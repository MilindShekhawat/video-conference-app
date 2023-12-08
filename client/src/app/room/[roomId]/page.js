'use client';
import socket from '@/lib/socket';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import { Button } from '@/components/ui/button';

export default function room() {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    socket.on('userjoined', (payload) => {
      setRemoteSocketId(payload.id);
    });
    return () => socket.off('userjoined');
  }, []);

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  };
  return (
    <main>
      <Link href='/'>Home</Link>
      {remoteSocketId && (
        <>
          <p>Remote User Connected</p>
          <Button onClick={() => handleCall()}>Start Call</Button>
        </>
      )}
      {myStream && (
        <ReactPlayer url={myStream} playing width='20%' height='20%' />
      )}
    </main>
  );
}
