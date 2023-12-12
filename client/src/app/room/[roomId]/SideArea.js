import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SideArea() {
  return (
    <Tabs defaultValue='chat' className='w-[400px] h-[93.3vh] p-2'>
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
  );
}
