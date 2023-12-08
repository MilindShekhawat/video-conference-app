'use client';
import { useState } from 'react';
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
  const [username, SetUsername] = useState('');
  const [room, SetRoom] = useState('');

  const handleSubmit = (e) => {};

  return (
    <main className='flex justify-center'>
      <Card className='w-80'>
        <CardHeader>
          <CardTitle>Join Meeting</CardTitle>
          <CardDescription>Enter your name and the meeting id.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={() => handleSubmit()}>
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
          <Button variant=''>Join</Button>
          <Button variant='destructive'>Cancel</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
