interface AuthErrorProps {
  message: string;
}

const AuthError = ({ message }: AuthErrorProps) => {
  return (
    <div className='rounded-md bg-red-500 p-2 text-white'>
      {message || 'An error occurred during authentication.'}
    </div>
  );
};

export default AuthError;