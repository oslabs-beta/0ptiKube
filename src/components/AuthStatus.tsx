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
      <div className='text-green-500 mb-4 flex flex-col items-center justify-center'>
        <div className='flex items-center gap-2'>
          {avatarUrl ? (
            <Image
            src={avatarUrl} 
            alt="GitHub avatar" 
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
      <p className='text-red-500 mb-4 flex flex-col items-center justify-center'>
        Please login using GitHub.
      </p>
    )
  }
};

export default AuthStatus;

// MOST RECENT WORKING RETURN STATEMENT - 2025-02-20 - BEFORE AVATAR IMPLEMENTATION ATTEMPT
  //   return (
  //     <p className='text-green-500 mb-4 flex flex-col items-center justify-center'>
  //       Welcome, {session.user?.name}!
  //     </p>
  //   );
  // } else {
  //   return (
  //     <p className='text-red-500 mb-4 flex flex-col items-center justify-center'>
  //       Please login using GitHub.
  //     </p>
  //   );

/*import React, { useEffect, useState } from 'react';

interface User {
  name: string;
}

const AuthStatus: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthStatus = async (): Promise<void> => {
      try {
        const res = await fetch('/auth/status');
        if (res.ok) {
          const data: { user: User } = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  if (loading) return null; // Let Suspense handle the loading UI

  return user ? (
    <p className='text-green-500 mb-4 flex flex-col items-center justify-center'>
      Welcome, {user.name}!
    </p>
  ) : (
    <p className='text-red-500 mb-4 flex flex-col items-center justify-center'>
      Please login using GitHub.
    </p>
  );
};

export default AuthStatus;
*/
