'use client';
import socket from '@/lib/socket';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '@/services/peer';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function room() {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = (payload) => {
    setRemoteSocketId(payload.id);
    console.log('handleuserjoined', payload);
  };

  const handleOffer = async (payload) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    // setMyStream(stream);
    const { offer, from } = payload;
    setRemoteSocketId(from);
    const answer = await peer.getAnswer(offer);
    console.log('handleoffer', payload);
    socket.emit('sendAnswer', { answer, to: from });
  };

  const handleAnswer = async (payload) => {
    const { answer, from } = payload;
    peer.setLocalDescription(answer);
    console.log('MyStream', myStream);
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
    console.log('handleanswer', payload);
  };

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    console.log('handleNegotiationNeeded', offer);
    socket.emit('negotiation needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegotiationIncoming = async (payload) => {
    const { offer, from } = payload;
    const answer = await peer.getAnswer(offer);
    console.log('handleNegotiationIncoming', payload);
    socket.emit('negotiation done', { answer, to: from });
  };

  const handleNegotiationFinal = async (payload) => {
    const { answer, from } = payload;
    await peer.setLocalDescription(answer);
    console.log('handleNegotiationFinal', payload);
  };

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit('sendOffer', { offer, to: remoteSocketId });
  };

  useEffect(() => {
    peer.peer.addEventListener('track', async (event) => {
      const remoteStream = event.streams;
      console.log('remoteStream', remoteStream);
      setRemoteStream(remoteStream[0]);
      console.log('setRemoteStream', remoteStream[0]);
    });
  }, [setRemoteStream]);

  useEffect(() => {
    peer.peer.addEventListener('negotiation needed', handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        'negotiation needed',
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    socket.on('userjoined', handleUserJoined);
    socket.on('receiveOffer', handleOffer);
    socket.on('receiveAnswer', handleAnswer);
    socket.on('negotiation needed', handleNegotiationIncoming);
    socket.on('negotiation final', handleNegotiationFinal);

    return () => {
      socket.off('userjoined');
      socket.off('receiveOffer');
      socket.off('receiveAnswer');
      socket.off('negotiation needed');
      socket.off('negotiation final');
    };
  }, [
    socket,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  return (
    <main>
      <Link href='/'>Home</Link>
      {remoteSocketId && (
        <>
          <p>Remote User Connected</p>
          <Button onClick={() => handleCall()} variant='outline'>
            Video
          </Button>
          <Button onClick={() => handleNegotiationNeeded()}>Negotiate</Button>
        </>
      )}
      {myStream && (
        <>
          MyStream
          <ReactPlayer url={myStream} playing width='20%' height='20%' />
        </>
      )}
      {remoteStream && (
        <>
          RemoteStream
          <ReactPlayer url={remoteStream} playing width='20%' height='20%' />
        </>
      )}
    </main>
  );
}
