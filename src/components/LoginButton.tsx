import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaSpinner } from 'react-icons/fa';

const LoginButton = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleLogin = (): void => {
    setLoading(true);
    signIn('github', {});
  };

  const handleLogout = (): void => {
    setLoading(true);
    signOut({ callbackUrl: '/login' }); // Redirect to home after logout
  };

  if (status === 'loading') {
    return <p className='text-gray-500'>Checking authentication...</p>;
  }

  return session ? (
    <button
      onClick={handleLogout}
      className='flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-white transition duration-500 ease-in-out hover:bg-red-800'
    >
      {loading ? <FaSpinner className='mr-2 animate-spin text-2xl' /> : null}
      <span className='font-medium'>
        {loading ? 'Logging out...' : 'Sign Out'}
      </span>
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className={`flex w-full items-center justify-center rounded-lg px-6 py-3 ${
        loading
          ? 'cursor-not-allowed border-2 border-navy_blue-100 bg-navy_blue-100 text-white shadow-md'
          : 'border-2 border-navy_blue-100 bg-white text-navy_blue-100 shadow-md transition-all duration-500 ease-in-out hover:bg-navy_blue-100 hover:text-white'
      }`}
      disabled={loading}
    >
      {loading ? (
        <FaSpinner className='mr-2 animate-spin text-2xl' />
      ) : (
        <FaGithub className='mr-2 text-2xl' />
      )}
      <span className='font-medium'>
        {loading ? 'Redirecting...' : 'Sign in with GitHub'}
      </span>
    </button>
  );
};

export default LoginButton;
