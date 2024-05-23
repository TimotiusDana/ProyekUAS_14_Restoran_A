import Image from "next/image";
import Head from "next/head";
import { Kanit, Anton } from 'next/font/google';
import Link from 'next/link';
import { UserIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

const bgHero = "/background.png";
const logoHero = "/logo-noodles.png";

export default function Page() {
  return (
    <div className="container">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
      </Head>

      <Image
        src={bgHero}
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="Background Hero"
      />

      <div className="logo-container">
        <Image
          src={logoHero}
          width={40}
          height={40}
          quality={100}
          alt="Logo Hero"
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            zIndex: 1,
          }}
        />
        <p
          style={{
            position: "absolute",
            left: "80px",
            top: "25px",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          Atma Barbershop
        </p>
      </div>

      <div className="title-container">
        <p
          style={{
            position: "absolute",
            top: "35%",
            left: "45%",
            bottom: "400px",
            transform: "translate(-30%, -50%)",
            color: "white",
            fontSize: "20px",
            textAlign: "right",
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          Menawarkan Mie Ayam terbaik
        </p>
      </div>

      <div className="title-container">
        <p
          style={{
            position: "absolute",
            top: "50%",
            left: "65%",
            transform: "translate(-90%, -50%)",
            color: "white",
            fontSize: "50px",
            fontWeight: "bold",
            textAlign: "left",
            fontFamily: 'Anton, sans-serif',
          }}
        >
          Our Barbershop Admin Dashboard
        </p>
      </div>

      <div className="login-container">
        <button
          style={{
            position: "absolute",
            right: "40px",
            top: "40px",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "10px",
              padding: "10px 25px",
            }}
          >
            Login
          </span>
        </button>
      </div>

      <div className="go-to-dashboard-container">
        <Link href="/dashboard">
          <button
            style={{
              position: "absolute",
              left: "12%",
              transform: "translateX(-50%)",
              bottom: "200px",
              cursor: "pointer",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "10px 25px",
            }}
          >
            for admin only
            <ArrowRightCircleIcon className='w-6 mx-2'/>
          </button>
        </Link>
      </div>
    </div>
  );
}
