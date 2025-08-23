import React from "react";

import { AuthProvider } from "./context/AuthContext";
import { Notification } from "./components/lib/Notification";
import { AppRoutes } from "./routes/Router";


const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppRoutes />
      <Notification />
    </AuthProvider>

  );
};

export default App;
