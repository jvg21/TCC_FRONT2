import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CompaniesPage from "./features/companies/CompaniesPage";
import UserPage from "./features/user/UserPage";
import GroupPage from "./features/group/GroupPage";
import LoginPage from "./features/login/LoginPage";
import FolderPage from "./features/folder/FolderPage";
import TaskPage from "./features/task/TaskPage";
import DocumentPage from "./features/document/DocumentPage";
import RecoverPasswordPage from "./features/login/ResetPassword";
import ResetTokenPage from "./features/login/ResetTokenPage";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { Notification } from "./components/lib/Notification";
import DashboardPage from "./features/dashboard/DashboardPage";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>}
        />
        <Route path="/resetpassword" element={
          <AuthRoute>
            <RecoverPasswordPage />
          </AuthRoute>
        } />
        <Route path="/resettokenpage" element={
          <AuthRoute>
            <ResetTokenPage />
          </AuthRoute>
        } />

        // PROTECTED ROUTES
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
        }
        />


        <Route path="/companies" element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />

        <Route path="/group" element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        } />

        <Route path="/folder" element={
          <ProtectedRoute>
            <FolderPage />
          </ProtectedRoute>
        } />

        <Route path="/task" element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        } />

        <Route path="/document" element={
          <ProtectedRoute>
            <DocumentPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Notification />
    </AuthProvider>

  );
};

export default App;
