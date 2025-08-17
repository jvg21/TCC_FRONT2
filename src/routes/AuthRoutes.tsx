import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const AuthRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};