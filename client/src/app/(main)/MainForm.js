'use client';
import { useState } from 'react';
import Link from 'next/link';
import socket from '@/lib/socket';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MainForm() {
  const router = useRouter();
  const [username, SetUsername] = useState('');
  const [room, SetRoom] = useState('');

  //Emits joinroom event to server
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('joinroom', { username, room });
    handleJoinRoom();
  };

  //Listens for joinroom event from server and redirects to room page
  const handleJoinRoom = () => {
    socket.on('joinroom', (payload) => {
      console.log('JoinRoom Payload:', payload);
      router.push(`/room/${payload.room}`);
    });
    return () => {
      socket.off('joinroom');
    };
  };

  return (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>Join Meeting</CardTitle>
        <CardDescription>Enter your name and the meeting id.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id='loginForm' onSubmit={(e) => handleSubmit(e)}>
          <div className='grid items-center w-full gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='username'>User Name</Label>
              <Input
                id='username'
                type='text'
                value={username}
                onChange={(e) => SetUsername(e.target.value)}
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='room'>Room</Label>
              <Input
                id='room'
                type='text'
                value={room}
                onChange={(e) => SetRoom(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button asChild form='loginForm'>
          <Link href='/meet'>Join</Link>
        </Button>
        <Button variant='destructive' form='loginForm'>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
