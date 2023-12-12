'use client';
import socket from '@/lib/socket';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '@/services/peer';
import Image from 'next/image';

import SideArea from './SideArea';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <main className='flex h-screen text-white bg-stone-800'>
      <div className='flex flex-col justify-between w-full p-2'>
        <div className='flex p-3 rounded-lg bg-stone-700'>
          <Link href='/'>Home</Link>
        </div>
        <div className='flex flex-wrap items-center h-full gap-2 p-3 px-4'>
          <div className='flex-1 basis-28 object-contain w-[700px] h-auto rounded-lg bg-stone-700'></div>
          {myStream && (
            <ReactPlayer
              url={myStream}
              playing
              width='100%'
              height='100%'
              className='rounded-lg'
            />
          )}
          {remoteStream && (
            <ReactPlayer
              url={remoteStream}
              playing
              width='100%'
              height='100%'
              className='rounded-lg'
            />
          )}
        </div>
        <div className='flex justify-center p-3 rounded-lg bg-stone-700'>
          {remoteSocketId ? (
            <div className='flex gap-3'>
              <Button onClick={() => handleCall()}>Call</Button>
              <Button onClick={() => handleNegotiationNeeded()}>
                Negotiate
              </Button>
            </div>
          ) : (
            <div className='flex gap-3'>
              <Button disabled onClick={() => handleCall()}>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Call
              </Button>
              <Button disabled onClick={() => handleNegotiationNeeded()}>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Negotiate
              </Button>
            </div>
          )}
        </div>
      </div>
      <SideArea />
    </main>
  );
}
