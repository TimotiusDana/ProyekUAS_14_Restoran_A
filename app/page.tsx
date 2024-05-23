import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/ui/home.module.css';
import { lusitana, dm } from '@/app/ui/fonts';



export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div> */}
      <header>
        <nav
        className="fixed inset-x-0 top-0 z-20 w-full px-4 py-1 bg-transparent transition duration-700 ease-out"
        >
          <div className="flex justify-between p-4">
            <div className="text-[2rem] leading-[3rem] text-black">
              <li className="flex items-center">
                <Image
                  src="/logo-noodles.png"
                  alt="logo"
                  width={90}
                  height={90}
                />
                <p className={`${dm.className} ml-4`}> <strong> Restaurant</strong></p>
              </li>
            </div>
          </div>
        </nav>

      </header>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        
          <p className={`${dm.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Selamat Datang di Restaurant</strong>. Hanya menyajikan yang terbaik.
          </p>
          <Link
            href="/Dashboard"
            className={`${dm.className} flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base`}
          >
            <span>Ke Dashboard (Hanya dapat diakses admin)</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
    </main>
  );
}
