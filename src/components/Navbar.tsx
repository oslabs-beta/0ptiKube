import Link from 'next/link';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: '700' });

export default function Navbar() {
  return (
    <nav className='bg-navy_blue-100 text-columbia_blue-900 p-4 fixed w-full top-0 shadow-xl w-full border-b-4 border-columbia_blue-900'>
      <div className='max-w-screen-2xl mx-auto flex justify-between items-center'>
        <h1
          className={`text-4xl font-bold text-columbia_blue-900 ${orbitron.className}`}
        >
          0PTIKUBE
        </h1>

        {/* Navigation Buttons*/}
        <div className='flex flex-wrap justify-center w-full:space-x-6 md:space-x-4 sm:space-x-2'>
          <Link href='/optimize'>
            <button
              className={`px-6 md:px-4 sm:px-2 py-2 text-md md:text-sm sm:text-sm bg-columbia_blue-900 ${orbitron.className} text-navy_blue-100 rounded-xl border-2 shadow-md transition-all duration-500 ease-in-out hover:bg-navy_blue-100 hover:border-2 hover:text-columbia_blue-900`}
            >
              Optimize
            </button>
          </Link>

          <Link href='/visualize'>
            <button
              className={`px-6 md:px-4 sm:px-2 py-2 text-md md:text-sm sm:text-sm bg-columbia_blue-900 ${orbitron.className} text-navy_blue-100 rounded-xl border-2 shadow-md transition-all duration-500 ease-in-out hover:bg-navy_blue-100 hover:border-2 hover:text-columbia_blue-900`}
            >
              Visualize
            </button>
          </Link>

          <Link href='/login'>
            <button
              className={`px-6 md:px-4 sm:px-2 py-2 text-md md:text-sm sm:text-sm bg-columbia_blue-900 ${orbitron.className} text-navy_blue-100 rounded-xl border-2 shadow-md transition-all duration-500 ease-in-out hover:bg-navy_blue-100 hover:border-2 hover:text-columbia_blue-900`}
            >
              Login/Logout
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

{
  /* <button
className={`px-6 py-2 text-md font-semibold bg-columbia_blue-900 ${orbitron.className} text-navy_blue-100 rounded-xl border-2 shadow-md transition-all duration-500 ease-in-out hover:bg-navy_blue-100 hover:border-2 hover:text-columbia_blue-900`}
> */
}
