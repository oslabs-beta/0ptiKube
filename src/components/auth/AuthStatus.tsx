import React, { useEffect, useState } from 'react';

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
