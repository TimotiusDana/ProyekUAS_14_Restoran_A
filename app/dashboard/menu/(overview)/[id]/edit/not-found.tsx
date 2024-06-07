import Link from 'next/link';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="bg-white p-8 items:center rounded-md shadow-md text-center">
        <div className="flex flex-col items-center"> 
          <div className="flex items-center">
            <ExclamationCircleIcon className="w-10 text-red-400 mr-4 self-center" />
            <h2 className="text-xl text-center ">404 Page Not Found</h2>
          </div>
        </div>
        <p className="mb-4 text-gray-600">Sorry, the page you are looking for could not be found.</p>
        <Link
          href="/dashboard"
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        >
          Go Back To Home
        </Link>
      </div>
    </main>
  );
}