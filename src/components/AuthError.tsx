import React from 'react';

interface AuthErrorProps {
  message: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
  return (
    <div className='bg-red-500 text-white p-2 rounded-md'>
      {message || 'An error occurred during authentication.'}
    </div>
  );
};

export default AuthError;
