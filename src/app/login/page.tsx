// Import SessionProvider@/components/LoginButton';/components/AuthStatus';components/AuthError';} from 'next/navigation';'next/font/google'({ subsets: ['latin'], weight: '700' }) = () => {eSearchParams();ull = searchParams.get('error')x flex-col items-center justify-center min-h-screen'>-10 rounded-2xl shadow
'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import LoginButton from '@/components/LoginButton';
import AuthStatus from '@/components/AuthStatus';
import AuthError from '@/components/AuthError';
import { useSearchParams } from 'next/navigation';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: '700' }); // Load Orbitron with bold weight

const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') === "unauthorized" ? "You must be logged in to access that page." : null;

  return (
    <SessionProvider>
      <div className='w-full max-w-screen-2xl px-4 md:px-8 lg:px-16 mx-auto flex justify-center items-center min-h-screen bg-navy_blue-100'>
        <div className='p-10 rounded-3xl shadow-2xl bg-columbia_blue-900 w-full max-w-md min-h-[500px] flex flex-col justify-between border border-white-200'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-navy_blue-100'>
              Login to{' '}
              <span className={`${orbitron.className} tracking-wide`}>
                0PTIKUBE
              </span>
            </h1>
            {error && <AuthError message={error} />}
          </div>

          <div className='flex flex-col items-center'>
            <AuthStatus />
          </div>

          <div className='mt-6 flex justify-center'>
            <LoginButton />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default LoginPage;
