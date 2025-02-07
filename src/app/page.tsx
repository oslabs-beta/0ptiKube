import React, { Suspense } from 'react';
import LoginPage from './login/page';
import Loading from './login/loading';

export default function LoginWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  );
}
