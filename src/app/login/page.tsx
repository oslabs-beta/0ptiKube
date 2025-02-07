'use client';

import LoginButton from '@/components/auth/LoginButton';
import AuthStatus from '@/components/auth/AuthStatus';
import AuthError from '@/components/auth/AuthError';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: '700' }); // Load Orbitron with bold weight

const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const error: string | null = searchParams.get('error');

  return (
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
  );
};

export default LoginPage;
