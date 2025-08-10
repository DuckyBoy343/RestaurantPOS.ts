import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { Toaster } from 'react-hot-toast';
import LeftHeader from "@/components/LeftMenu"; 
import MainMenu from '@/components/HeaderMenu';

export default function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MainMenu /> {/* <-- 2. Use it here */}
      <main className="container mt-4"> {/* Added for nice spacing */}
        {children}
        <Toaster position="top-center" />
      </main>
    </ProtectedRoute>
  );
}