import Link from 'next/link'
import socket from '@/utils/socket'

export default function Home() {
  return (
    <main>
      Main Page
      <Link href='/conferencePage'>Link</Link>
    </main>
  )
}
