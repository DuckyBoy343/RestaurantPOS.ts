'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');

        router.push('/login');
    };

    return (
        <button 
            onClick={handleLogout} 
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
            Cerrar Sesión
        </button>
    );
}
