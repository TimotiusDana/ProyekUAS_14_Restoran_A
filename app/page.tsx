import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/ui/home.module.css';
import { lusitana, dm } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-auto">
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
          <nav className="fixed inset-x-0 top-0 z-20 w-full px-4 py-1 bg-transparent transition duration-700 ease-out">
            <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
              <div className="flex items-center text-[1.5rem] md:text-[2rem] leading-[2.5rem] md:leading-[3rem] text-white">
                <Image
                  src="/logo-noodles.png"
                  alt="logo"
                  width={60}
                  height={60}
                  className="md:w-20 md:h-20"
                />
                <span className={`${dm.className} ml-2 md:ml-4 text-white text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse`}>
                  <strong>NoodleLab</strong>
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 text-lg font-bold tracking-tight">
                <Link href="/menu-page">
                  <button className="px-6 py-2 text-white transition-colors bg-transparent rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-700 md:text-base">Menu</button>
                </Link>
                <Link href="/menu">
                  <button className="px-6 py-2 text-white transition-colors bg-transparent rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-700 md:text-base">Lokasi</button>
                </Link>
                <Link href="/menu">
                  <button className="px-6 py-2 text-white transition-colors bg-transparent rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-700 md:text-base">Tentang Kami</button>
                </Link>
                <Link
                  href="/dashboard"
                  className={`${dm.className} flex items-center gap-3 rounded-lg bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:from-gray-700 hover:via-gray-500 hover:to-gray-700 md:px-6 md:py-3 md:text-base`}
                >
                  <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  <span>Dashboard Admin</span>
                  <ArrowRightIcon className="w-4 h-4 md:w-5 h-5" />
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <div className="mt-20 flex grow flex-col gap-4 items-center text-center md:text-left md:items-start md:flex-row">
          <p className={`${dm.className} text-lg md:text-xl text-white md:text-3xl md:leading-normal`}>
            <strong className="text-yellow-400">Selamat Datang di NoodleLab</strong>. Hanya menyajikan yang terbaik.
          </p>
        </div>
        <div className="flex items-center bg-black bg-opacity-50 p-4 rounded-md space-x-4">
            <Image
              src="/Noodle-Disp.jpeg"
              alt="Welcome Image"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
      </div>

      {/* Spacer to push footer further down */}
      <div className="flex-grow"></div>

      {/* Footer with Contact Us and Address */}
      <footer className="relative z-10 flex flex-col items-center justify-center w-full bg-black bg-opacity-50 text-white py-6">
        <div className="text-center">
          <p className={`${dm.className} text-base md:text-lg`}>Contact Us</p>
          <p className={`${dm.className} text-sm md:text-base`}>
            Email: contact@restaurant.com
          </p>
          <p className={`${dm.className} text-sm md:text-base`}>
            Phone: +62 123 4567 890
          </p>
          <p className={`${dm.className} text-base md:text-lg mt-4`}>Alamat</p>
          <p className={`${dm.className} text-sm md:text-base`}>
            Jl. Noodle Street No. 123, Yogyakarta, Indonesia
          </p>
        </div>
      </footer>
    </main>
  );
}