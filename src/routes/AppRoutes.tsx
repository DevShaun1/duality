import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Reflection from "@/pages/Reflection";
import WeeklyReview from "@/pages/WeeklyReview";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reflection/new" element={<Reflection />} />
      <Route path="/weekly-review" element={<WeeklyReview />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}