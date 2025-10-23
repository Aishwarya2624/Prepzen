import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { LoaderPage } from "@/routes/loader-page";

export const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoaderPage />;
  }
  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};