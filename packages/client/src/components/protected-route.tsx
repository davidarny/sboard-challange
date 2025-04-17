import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
