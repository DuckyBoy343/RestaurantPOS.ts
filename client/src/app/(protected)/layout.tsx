import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import MainMenu from '@/components/HeaderMenu';

export default function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MainMenu />
      <main className="container mt-4">
        {children}
        <Toaster position="top-center" />
      </main>
    </ProtectedRoute>
  );
}