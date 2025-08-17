import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoutes } from "./ProtectedRoutes"
import DocumentPage from "../features/document/DocumentPage"
import TaskPage from "../features/task/TaskPage"
import FolderPage from "../features/folder/FolderPage"
import GroupPage from "../features/group/GroupPage"
import UserPage from "../features/user/UserPage"
import CompaniesPage from "../features/companies/CompaniesPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import ResetTokenPage from "../features/login/ResetTokenPage"
import { AuthRoutes } from "./AuthRoutes"
import LoginPage from "../features/login/LoginPage"
import RecoverPasswordPage from "../features/login/ResetPassword"
import { DevRoutes } from "./DevRoutes"
import { AdmRoutes } from "./AdmRoutes"

export const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/login" element={
                <AuthRoutes>
                    <LoginPage />
                </AuthRoutes>}
            />
            <Route path="/resetpassword" element={
                <AuthRoutes>
                    <RecoverPasswordPage />
                </AuthRoutes>
            } />
            <Route path="/resettokenpage" element={
                <AuthRoutes>
                    <ResetTokenPage />
                </AuthRoutes>
            } />

        // PROTECTED ROUTES

            <Route path="/" element={
                <ProtectedRoutes>
                    <DashboardPage />
                </ProtectedRoutes>
            }
            />
            <Route path="/companies" element={
                <DevRoutes>
                    <CompaniesPage />
                </DevRoutes>
            } />

            <Route path="/user" element={
                <AdmRoutes>
                    <UserPage />
                </AdmRoutes>
            } />

            <Route path="/group" element={
                <AdmRoutes>
                    <GroupPage />
                </AdmRoutes>
            } />

            <Route path="/folder" element={
                <AdmRoutes>
                    <FolderPage />
                </AdmRoutes>
            } />

            <Route path="/task" element={
                <AdmRoutes>
                    <TaskPage />
                </AdmRoutes>
            } />

            <Route path="/document" element={
                <AdmRoutes>
                    <DocumentPage />
                </AdmRoutes>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        )
}