import Link from 'next/link';
import socket from '@/utils/socket';
import MainForm from './MainForm';

export default function Home() {
  return (
    <main>
      <Link href='/meet'>Link</Link>
      <h1>Join</h1>
      <MainForm />
    </main>
  );
}
