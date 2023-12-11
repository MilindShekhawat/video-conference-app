'use client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default function room() {
  return (
    <main className='flex h-screen text-white bg-slate-800'>
      <div className='w-full'>
        <div className='flex p-3 border-2'>Header</div>
        <div className='flex p-3 px-4'>{/*  */}</div>
      </div>
      <Tabs defaultValue='chat' className='w-[400px] h-[93vh] p-2'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='chat'>Chat</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
        </TabsList>
        <TabsContent value='chat' className='h-full'>
          <Card className='flex flex-col justify-between h-full'>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className=''>
              <Input type='text' placeholder='Type your message...' />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='participants' className='h-full'>
          <Card className='flex flex-col justify-between h-full'>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter></CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
