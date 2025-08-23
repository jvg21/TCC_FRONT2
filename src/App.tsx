import React from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Notification } from "./components/lib/Notification";
import { AppRoutes } from "./routes/Router";
import Sidebar from "./components/common/Sidebar";
import { useAuthContext } from "./context/AuthContext";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  
  // Rotas que não devem exibir a sidebar
  const authRoutes = ['/login', '/resetpassword', '/resettokenpage'];
  const shouldShowSidebar = isAuthenticated && !authRoutes.includes(location.pathname);

  if (shouldShowSidebar) {
    return (
      <Sidebar>
        <AppRoutes />
      </Sidebar>
    );
  }

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Notification />
    </AuthProvider>
  );
};

export default App;