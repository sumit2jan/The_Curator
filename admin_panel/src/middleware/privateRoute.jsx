import React from "react";
//import { useAuth } from "../context/Authcontext";
import { Navigate, Outlet, useLocation } from "react-router-dom";


const PrivateRoute = () => {
  const { token, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
