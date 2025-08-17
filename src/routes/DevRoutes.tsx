import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AuthRoutes } from "./AuthRoutes";

export const DevRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();

  if (user && user.Profile !== 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthRoutes>{children}</AuthRoutes>;
};