import { useAuth } from "@/store/auth";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
