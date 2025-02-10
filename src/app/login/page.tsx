// Import SessionProider@/components/LoginButton';/components/AuthStatus';components/AuthError';} from 'next/navigation';'next/font/google'({ subsets: ['latin'], weight: '700' }) = () => {eSearchParams();ull = searchParams.get('error')x flex-col items-center justify-center min-h-screen'>-10 rounded-2xl shadow
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
  const error: string | null = searchParams.get('error');

  return (
    <SessionProvider>
      <div className='flex flex-col items-center justify-center min-h-screen bg-[#0a0a2a]'>
        <div className='p-10 rounded-2xl shadow-2xl bg-[#f5f5f5] w-full max-w-md min-h-[500px] flex flex-col justify-between'>
          <div className='text-center'>
            <h1 className='text-3xl font-semibold text-[#000080]'>
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

          <div className='mt-6'>
            <LoginButton />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default LoginPage;
