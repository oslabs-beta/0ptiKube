'use client';

interface ErrorPageProps {
  error: Error;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-red-500'>
      <h1 className='text-2xl font-bold'>Error</h1>
      <p>{error.message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
};

export default ErrorPage;
