import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const DevRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();

  if (user && user.Profile !== 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ProtectedRoutes>{children}</ProtectedRoutes>;
};