import Link from 'next/link';

export default function NotFound() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy_blue-100">
        <div className="p-10 rounded-3xl shadow-2xl bg-columbia_blue-900 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-navy_blue-100 mb-4">404 - Not Found</h1>
          <p className="text-navy_blue-100 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-navy_blue-100 text-columbia_blue-900 rounded-xl border-2 shadow-md transition-all duration-500 ease-in-out hover:bg-columbia_blue-900 hover:text-navy_blue-100"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }