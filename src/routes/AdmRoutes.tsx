import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const AdmRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();

  // Verifica se o usuário está autenticado e se é um administrador ou dev
  if (user && user.Profile > 2) {
    return <Navigate to="/" replace />;
  }

  return <ProtectedRoutes>{children}</ProtectedRoutes>;
};