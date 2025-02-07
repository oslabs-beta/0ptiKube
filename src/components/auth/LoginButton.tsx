import React, { useState } from 'react';
import { FaGithub, FaSpinner } from 'react-icons/fa6';

const LoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (): void => {
    setLoading(true); // Start loading animation
    window.location.href = '/auth/github'; // Redirect to backend OAuth
  };

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md transition-all duration-700 ease-in-out ${
        loading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-white text-black hover:bg-[#000080] hover:text-white hover:border-[#000080] hover:shadow-lg hover:opacity-80'
      }`}
      disabled={loading} // Disable button while loading
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
