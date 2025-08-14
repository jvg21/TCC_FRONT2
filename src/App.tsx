import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CompaniesPage from "./features/companies/CompaniesPage";
import PageLayout from "./components/common/PageLayout";
import UserPage from "./features/user/UserPage";
import GroupPage from "./features/group/GroupPage";
import LoginPage from "./features/login/LoginPage";
import FolderPage from "./features/folder/FolderPage";
import TaskPage from "./features/task/TaskPage";
import DocumentPage from "./features/document/DocumentPage";
import RecoverPasswordPage from "./features/login/ResetPassword";
import ResetTokenPage from "./features/login/ResetTokenPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout title="Dashboard"><div>Home</div></PageLayout>} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/group" element={<GroupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resetpassword" element={<RecoverPasswordPage />} />
      <Route path="/resettokenpage" element={<ResetTokenPage />} />
      <Route path="/folder" element={<FolderPage />} />
      <Route path="/task" element={<TaskPage />} />
      <Route path="/document" element={<DocumentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
