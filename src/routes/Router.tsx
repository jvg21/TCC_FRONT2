import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoutes } from "./ProtectedRoutes"
import DocumentPage from "../features/document/DocumentPage"
import TaskPage from "../features/task/TaskPage"
import FolderPage from "../features/folder/FolderPage"
import GroupPage from "../features/group/GroupPage"
import CompaniesPage from "../features/companies/CompaniesPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import ResetTokenPage from "../features/login/ResetTokenPage"
import { AuthRoutes } from "./AuthRoutes"
import LoginPage from "../features/login/LoginPage"
import RecoverPasswordPage from "../features/login/ResetPassword"
import { DevRoutes } from "./DevRoutes"
import { AdmRoutes } from "./AdmRoutes"
import UserPage from "../features/user/UserPage"
import SettingsPage from "../features/settings/SettingPage"
import { Sidebar } from "lucide-react"

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

            {/* PROTECTED ROUTES */}

            <Route path="/" element={
                <ProtectedRoutes>
                    <Sidebar>
                        <DashboardPage />
                    </Sidebar>

                </ProtectedRoutes>
            } />


            <Route path="/settings" element={
                <ProtectedRoutes>
                    <Sidebar>
                        <SettingsPage />
                    </Sidebar>
                </ProtectedRoutes>
            } />

            <Route path="/companies" element={
                <DevRoutes>
                    <Sidebar>
                        <CompaniesPage />
                    </Sidebar>
                </DevRoutes>
            } />

            <Route path="/user" element={
                <AdmRoutes>
                    <Sidebar>
                        <UserPage />
                    </Sidebar>
                </AdmRoutes>
            } />

            <Route path="/group" element={
                <AdmRoutes>
                    <Sidebar>
                        <GroupPage />
                    </Sidebar>
                </AdmRoutes>
            } />

            <Route path="/folder" element={
                <AdmRoutes>
                    <Sidebar>
                        <FolderPage />
                    </Sidebar>
                </AdmRoutes>
            } />

            <Route path="/task" element={
                <AdmRoutes>
                    <Sidebar>
                        <TaskPage />
                    </Sidebar>
                </AdmRoutes>
            } />

            <Route path="/document" element={
                <AdmRoutes>
                    <Sidebar>
                        <DocumentPage />
                    </Sidebar>
                </AdmRoutes>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}