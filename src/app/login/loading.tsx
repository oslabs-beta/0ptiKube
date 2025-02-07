'use client';

import { FaSpinner } from 'react-icons/fa';

const Loading: React.FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg=[#0a0a2a]'>
      <div className='flex flex-col items-center'>
        <FaSpinner className='inline-block text-5xl text-[#000080] animate-spin' />
        <p className='text-xl font-semibold text-white mt-4'>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
