/**
 * Login button component that handles GitHub authentication
 * - Displays different UI states based on authentication status
 *
 * @component
 */
import { signIn, signOut, useSession } from 'next-auth/react';
import { JSX, useState } from 'react';
import { FaGithub, FaSpinner } from 'react-icons/fa';

/**
 * A button component that provides GitHub authentication functionality
 *
 * Handles three main states:
 * 1. Loading - when authentication status is being checked
 * 2. Authenticated - shows a logout button
 * 3. Unauthenticated - shows a GitHub login button
 */
const LoginButton = (): JSX.Element => {
  /**
   * Authentication session data and status from next-auth
   */
  const { data: session, status } = useSession();
  /**
   * Loading state to handle UI during authentication process
   */
  const [loading, setLoading] = useState(false);

  /**
   * Handles the GitHub login process
   * - Sets loading state to true and initiates GitHub OAuth authentication
   */
  const handleLogin = (): void => {
    setLoading(true);
    signIn('github', {});
  };

  /**
   * Handles the logout process
   * 1. Sets loading state to true and signs the user out
   * 2. Redirects to /login after successful logout
   */
  const handleLogout = (): void => {
    setLoading(true);
    signOut({ callbackUrl: '/login' });
  };

  /**
   * Show loading status indicator when authentication status is being checked
   */
  if (status === 'loading') {
    return <p className='text-gray-500'>Checking authentication...</p>;
  }

  /**
   * Render appropriate button based on authentication state
   * 1. If authenticated (session exists): Show 'Sign Out' button
   * 2. If not authenticated: Show 'Sign in with GitHub' button
   */
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
