import React from "react";

import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { Notification } from "./components/lib/Notification";
import { AppRoutes } from "./routes/Router";
import Sidebar from "./components/common/Sidebar";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Sidebar>
      <AppRoutes />
    </Sidebar>
      
      <Notification />
    </AuthProvider>

  );
};

export default App;
