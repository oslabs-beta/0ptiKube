'use client';
import React, { useState } from 'react';
import { FaGithub, FaSpinner } from 'react-icons/fa';
import { signIn, signOut, useSession } from 'next-auth/react';

const LoginButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleLogin = (): void => {
    setLoading(true);
    signIn('github', { callbackUrl: '/visualize' });
  };

  const handleLogout = (): void => {
    setLoading(true);
    signOut({ callbackUrl: '/' }); // Redirect to home after logout
  };

  if (status === 'loading') {
    return <p className='text-gray-500'>Checking authentication...</p>;
  }

  return session ? (
    <button
      onClick={handleLogout}
      className='flex items-center justify-center w-full px-6 py-3 bg-red-500 text-white hover:bg-red-700 rounded-lg'
    >
      {loading ? <FaSpinner className='animate-spin text-2xl mr-2' /> : null}
      <span className='font-medium'>
        {loading ? 'Logging out...' : 'Sign Out'}
      </span>
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center w-full px-6 py-3 rounded-lg ${
        loading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-white text-black hover:bg-[#000080] hover:text-white'
      }`}
      disabled={loading}
    >
      {loading ? (
        <FaSpinner className='animate-spin text-2xl mr-2' />
      ) : (
        <FaGithub className='text-2xl mr-2' />
      )}
      <span className='font-medium'>
        {loading ? 'Redirecting...' : 'Sign in with GitHub'}
      </span>
    </button>
  );
};

export default LoginButton;
