import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='bg-gray-900 text-white p-4 fixed w-full top-0 shadow-lg'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <h1 className='text-xl font-bold'>0PTIKUBE</h1>
        <div className='space-x-4'>
          <Link href='./optimize'>Optimize</Link>
          <Link href='./visualize'>Visualize</Link>
          <Link href='./login'>Login</Link>
        </div>
      </div>
    </nav>
  );
}
