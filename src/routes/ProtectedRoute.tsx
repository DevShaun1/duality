import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';

type ProtectedRouteProps = {
    redirectTo: string;
    requireAuth?: boolean;
};

export default function ProtectedRoute({
    redirectTo,
    requireAuth = true,
}: ProtectedRouteProps) {
    const { isLoggedIn } = useAuth();

    const canAccessRoute = requireAuth ? isLoggedIn : !isLoggedIn;

    return canAccessRoute ? <Outlet /> : <Navigate to={redirectTo} replace />;
}