import { useState } from 'react';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid'; 
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { dm } from '@/app/ui/fonts';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
    
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_login.jpg"
          alt="Background for desktop"
          layout="fill"
          objectFit="cover"
          className="block md:hidden opacity-50"
        />
        <Image
          src="/bg_login.jpg"
          alt="Background for mobile"
          layout="fill"
          objectFit="cover"
          className="hidden md:block opacity-50"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[400px] p-6 bg-gradient-to-b from-gray-900 to-gray-900 bg-opacity-50 rounded-lg shadow-lg">
        <div className="flex h-20 w-full items-end rounded-lg bg-gradient-to-b from-red-800 to-red-800 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <div className="text-center text-2xl font-bold text-yellow-500 mt-4">Welcome to NoodleLab</div>
        <LoginForm />

        <div className="flex space-x-4 mt-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-700 text-white">
            <UserIcon className="w-10 h-10" /> 
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-center w-full bg-black bg-opacity-70 text-white py-6 mt-10">
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