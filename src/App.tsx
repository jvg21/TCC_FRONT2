import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CompaniesPage from "./features/companies/CompaniesPage";
import PageLayout from "./components/common/PageLayout";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout title="Dashboard"><div>Home</div></PageLayout>} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
