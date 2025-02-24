/**
 * NavBar component for 0PTIKUBE application
 *
 * @component
 */
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import { JSX } from 'react';

// Configure the Orbitron font with specific weight and subset
const orbitron = Orbitron({ subsets: ['latin'], weight: '700' });

/**
 * Renders the NavBar component for the application
 *
 * Consists of:
 * 1. Application logo with imported Google font - Orbitron
 * 2. Navigation button for primary application pages - optimize, visualize, login
 *
 * @returns {JSX.Element}
 */
export default function Navbar(): JSX.Element {
  return (
    <nav className='fixed top-0 w-full border-b-4 border-columbia_blue-900 bg-navy_blue-100 p-4 text-columbia_blue-900 shadow-xl'>
      <div className='mx-auto flex max-w-screen-2xl items-center justify-between'>
        <h1
          className={`text-4xl font-bold text-columbia_blue-900 ${orbitron.className}`}
        >
          0PTIKUBE
        </h1>

        {/* Navigation Buttons*/}
        <div className='w-full:space-x-6 flex flex-wrap justify-center sm:space-x-2 md:space-x-4'>
          <Link href='/optimize'>
            <button
              className={`text-md bg-columbia_blue-900 px-6 py-2 sm:px-2 sm:text-sm md:px-4 md:text-sm ${orbitron.className} rounded-xl border-2 text-navy_blue-100 shadow-md transition-all duration-500 ease-in-out hover:border-2 hover:bg-navy_blue-100 hover:text-columbia_blue-900`}
            >
              Optimize
            </button>
          </Link>

          <Link href='/visualize'>
            <button
              className={`text-md bg-columbia_blue-900 px-6 py-2 sm:px-2 sm:text-sm md:px-4 md:text-sm ${orbitron.className} rounded-xl border-2 text-navy_blue-100 shadow-md transition-all duration-500 ease-in-out hover:border-2 hover:bg-navy_blue-100 hover:text-columbia_blue-900`}
            >
              Visualize
            </button>
          </Link>

          <Link href='/login'>
            <button
              className={`text-md bg-columbia_blue-900 px-6 py-2 sm:px-2 sm:text-sm md:px-4 md:text-sm ${orbitron.className} rounded-xl border-2 text-navy_blue-100 shadow-md transition-all duration-500 ease-in-out hover:border-2 hover:bg-navy_blue-100 hover:text-columbia_blue-900`}
            >
              Login/Logout
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
