// app/page.tsx
'use client';

import React, { Suspense } from 'react';
import LoginPage from './login/page'; // Import the LoginPage from components folder
import Loading from './login/loading'; // Assuming you have a Loading component
import { SessionProvider } from 'next-auth/react';

export default function LoginWrapper() {
  return (
    <SessionProvider>
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    </SessionProvider>
  );
}
