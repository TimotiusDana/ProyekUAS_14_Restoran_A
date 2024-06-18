import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';  // Importing the Image component
 
// import { signOut } from '@/auth';
 
export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-900">
      <Link
        className="relative mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40"
        href="/"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg_noodles.jpg"
            alt="Background noodles"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        
        <div className="relative z-10 w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-900 md:block"></div>  {/* Changed to bg-gray-900 */}
 
        <Link
          href="/dashboard"
        >
          <form>
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-green-600 p-3 text-sm font-medium hover:bg-green-500 hover:text-black-800 md:flex-none md:justify-start md:p-2 md:px-3">
              <ArrowUturnLeftIcon className="w-6" />
              <div className="hidden md:block">Kembali</div>
            </button>
          </form>
        </Link>
 
        {/* <form
        action={async () => {
          'use server';modif
          await signOut();
        }}
        > */}
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-red-800 p-3 text-sm font-medium hover:bg-red-600 hover:text-black-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Keluar</div>
          </button>
        {/* </form> */}
      </div>
    </div>
  );
}
  