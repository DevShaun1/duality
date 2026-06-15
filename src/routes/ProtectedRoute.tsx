import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';

export default function ProtectedRoute() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}