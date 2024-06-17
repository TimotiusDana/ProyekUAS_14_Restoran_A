"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('https://maps.app.goo.gl/3T44Aaygug1Ng8uY8');
    }, [router]);

    return <strong>Ini adalah halaman yang menampilkan lokasi restoran di Maps.</strong>;
}
