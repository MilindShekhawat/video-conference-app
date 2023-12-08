'use client';
import socket from '@/lib/socket';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '@/services/peer';

import { Button } from '@/components/ui/button';

export default function room() {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    socket.on('userjoined', handleUserJoined);
    socket.on('receiveOffer', handleOffer());
    socket.on('receiveAnswer', handleAnswer());

    return () => {
      socket.off('userjoined');
      socket.off('receiveOffer');
      socket.off('receiveAnswer');
    };
  }, []);

  const handleUserJoined = () => {
    setRemoteSocketId(payload.id);
  };

  const handleOffer = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const { offer, from } = payload;
    setRemoteSocketId(from);
    const answer = await peer.getAnswer(offer);
    socket.emit('sendAnswer', { answer, to: from });
  };

  const handleAnswer = async () => {
    const { answer, from } = payload;
    peer.setLocalDescription(answer);
    console.log('Answer Received');
  };

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit('sendOffer', { offer, to: remoteSocketId });
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
