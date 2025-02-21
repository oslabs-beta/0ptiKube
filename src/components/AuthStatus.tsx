'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const AuthStatus: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>; // You can show a loading indicator

  if (status === 'authenticated') {
    // Get avatarUrl from either picture or image property
    const avatarUrl = session?.user?.picture || session?.user?.image;

    return (
      <div className='mb-4 flex flex-col items-center justify-center text-green-500'>
        <div className='flex items-center gap-2'>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt='GitHub avatar'
              width={32}
              height={32}
              className='rounded-full'
            />
          ) : null}
          <p>Welcome, {session?.user?.name || 'User'}!</p>
        </div>
      </div>
    );
  } else {
    return (
      <p className='mb-4 flex flex-col items-center justify-center text-red-500'>
        Please login using GitHub.
      </p>
    );
  }
};

export default AuthStatus;
