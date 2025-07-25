import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-4xl font-semibold">404</h2>
      <p>Menu tidak ditemukan.</p>
      <Link
        href="/dashboard/menu"
        className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Kembali
      </Link>
    </main>
  );
}