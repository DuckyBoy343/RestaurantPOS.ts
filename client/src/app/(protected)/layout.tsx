import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { Toaster } from 'react-hot-toast';

export default function ProtectedPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <header className="bg-gray-800 text-white p-4 flex justify-end">
                <LogoutButton />
            </header>
            
            <main>
                {children}
                <Toaster position="top-center" />
            </main>
        </ProtectedRoute>
    );
}