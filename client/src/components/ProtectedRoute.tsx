'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            router.push('/login');
        } else {
            setIsVerified(true);
        }
    }, [router]);

    if (!isVerified) {
        return null;
    }

    return <>{children}</>;
}
