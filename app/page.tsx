import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/ui/home.module.css';
import { lusitana, dm } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col p-6">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_noodles.jpg"
          alt="Background untuk versi desktop"
          layout="fill"
          objectFit="cover"
          className="block md:hidden"
        />
        <Image
          src="/bg_noodles.jpg"
          alt="Background untuk versi mobile"
          layout="fill"
          objectFit="cover"
          className="hidden md:block"
        />
      </div>
      
      {/* Header and content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 w-full md:w-3/5 md:px-28 md:py-12">
        <header className="w-full">
          <nav className="fixed inset-x-0 top-0 z-20 w-full px-4 py-1 bg-red-700 transition duration-700 ease-out">
            <div className="flex justify-between p-4">
              <div className="text-[1.5rem] md:text-[2rem] leading-[2.5rem] md:leading-[3rem] text-white">
                <ul className="flex items-center">
                  <li>
                    <Image
                      src="/logo-noodles.png"
                      alt="logo"
                      width={40}
                      height={40}
                      className="md:w-40 md:h-40"
                    />
                  </li>
                  <li className={`${dm.className} ml-2 md:ml-4`}>
                    <strong>Restaurant</strong>
                  </li>
                </ul>
                <div className="flex items-center space-x-4 text-lg font-bold-tracking-tight">
                  <Link href="/menu">
                    <button className="px-6 py-2 text-white transition-colors hover:text-yellow-400 md:text-base"> Menu </button>
                  </Link>

                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="mt-20 flex grow flex-col gap-4 items-center text-center md:text-left md:items-start md:flex-row">
          <p className={`${dm.className} text-lg md:text-xl text-white md:text-3xl md:leading-normal`}>
            <strong>Selamat Datang di Restaurant</strong>. Hanya menyajikan yang terbaik.
          </p>
          <Link
            href="/dashboard"
            className={`${dm.className} flex items-center gap-5 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-400 md:px-6 md:py-3 md:text-base`}
          >
            <span>Ke Dashboard (Hanya dapat diakses admin)</span>
            <ArrowRightIcon className="w-4 md:w-5 md:w-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}
