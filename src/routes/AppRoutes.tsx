import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Reflection from "@/pages/Reflection";
import WeeklyReview from "@/pages/WeeklyReview";
import NotFound from "@/pages/NotFound";
import History from "@/pages/History";
import PublicLayout from "@/components/layout/PublicLayout";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/features/auth/AuthProvider";

export function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
       <Route element={<PublicLayout isLoggedIn={isLoggedIn} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
       </Route>

       <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/weekly-review" element={<WeeklyReview />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Route>

      <Route path="/" element={
        <Navigate to={isLoggedIn ? '/reflection' : '/login'} replace />
      }/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}