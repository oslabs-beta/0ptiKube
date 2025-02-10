'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

const AuthStatus: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>; // You can show a loading indicator

  if (status === 'authenticated') {
    return (
      <p className='text-green-500 mb-4 flex flex-col items-center justify-center'>
        Welcome, {session.user?.name}!
      </p>
    );
  } else {
    return (
      <p className='text-red-500 mb-4 flex flex-col items-center justify-center'>
        Please login using GitHub.
      </p>
    );
  }
};

export default AuthStatus;

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
