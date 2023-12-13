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
  const [myPeer, setMyPeer] = useState(null);
  const [remotePeer, setRemotePeer] = useState(null);

  //Stores the socketId of the user who joined the room
  const handleNewUserJoined = (data) => {
    const { userName, room } = data;
    console.log(data);
    console.log(`${userName} joined the room`);
    setRemoteSocketId(socket.id);
  };

  //Handles the onClick event of the Call button
  const handleCall = async () => {
    //Gets the stream of current user
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: false,
    });
    setMyStream(stream);
    //Create a peer for current user
    createPeer(socket.id);
    socket.emit('offer', { offer, to: remoteSocketId });
  };

  const createPeer = (mySocketId) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478',
          ],
        },
      ],
    });
    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent();
    return peer;
  };

  const handleICECandidate = (data) => {
    const candidate = new RTCIceCandidate(data);
    peer.addIceCandidate(candidate);
  };
  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const data = {
        to: remoteSocketId,
        candidate: e.candidate,
      };
      //send data to room page
      socket.emit('ice-candidate', data);
    }
  };

  const handleTrackEvent = (e) => {
    remoteStream = e.streams[0];
  };

  const handleNegotiationNeededEvent = async () => {
    const offer = await myPeer.createOffer();
    await myPeer.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit('offer', { offer, to: remoteSocketId });
  };

  const handleGettingOffer = async (data) => {
    const { offer, from } = data;
    createPeer(from);
    const answer = await peer.getAnswer(offer);
    socket.emit('answer', { answer, to: from });
  };
  const handleGettingAnswer = async (data) => {};

  //Handles all socket events
  useEffect(() => {
    socket.on('newUserJoined', handleNewUserJoined);
    socket.on('offer', handleGettingOffer);
    socket.on('answer', handleGettingAnswer);
    socket.on('ice-candidate', handleICECandidate);
    return () => {
      socket.off('newUserJoined');
      socket.off('offer');
      socket.off('answer');
    };
  }, [
    socket,
    handleNewUserJoined,
    handleOffer,
    handleAnswer,
    handleICECandidate,
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
