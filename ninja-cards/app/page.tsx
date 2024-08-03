import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className='text-green-600'>que pasa</h1>
      <Link href='users'>Users</Link>
    </main>
  )
}
