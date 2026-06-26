import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import ReflectionPage from '@/pages/ReflectionPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ReflectionsPage from '@/pages/ReflectionsPage';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@/features/auth/AuthProvider';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import ProfilePage from '@/pages/ProfilePage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ReflectionInsightPage from '@/pages/ReflectionInsightPage';
import DiscoverPatternsPage from '@/pages/DiscoverPatternsPage';

export function AppRoutes() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute requireAuth={false} redirectTo="/reflect" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute redirectTo="/login" />}>
        <Route element={<AppLayout />}>
          <Route path="/reflect" element={<ReflectionPage />} />
          <Route path="/reflections" element={<ReflectionsPage />} />
          <Route path="/reflections/:reflectionId" element={<ReflectionInsightPage />} />
          <Route path="/discover-patterns" element={<DiscoverPatternsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={isLoggedIn ? '/reflect' : '/login'} replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
