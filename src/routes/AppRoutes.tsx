import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from '@/pages/Signup'
import Login from '@/pages/Login'
import Reflection from '@/pages/Reflection'
import WeeklyReview from '@/pages/WeeklyReview'
import NotFound from '@/pages/NotFound'
import History from '@/pages/History'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '@/features/auth/AuthProvider'
import FullScreenLoader from '@/components/common/FullScreenLoader'
import Profile from '@/pages/Profile'

export function AppRoutes() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) return <FullScreenLoader />

  return (
    <Routes>
      <Route element={<ProtectedRoute requireAuth={false} redirectTo="/reflection" />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute redirectTo="/login" />}>
        <Route element={<AppLayout />}>
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/weekly-review" element={<WeeklyReview />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={isLoggedIn ? '/reflection' : '/login'} replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
