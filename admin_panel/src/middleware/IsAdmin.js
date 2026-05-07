import { useAuth } from "../context/Authcontext";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p>Loading...</p>;
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;