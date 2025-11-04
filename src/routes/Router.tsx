import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoutes } from "./ProtectedRoutes"
import DocumentPage from "../features/document/DocumentPage"
import TaskPage from "../features/task/TaskPage"
import FolderPage from "../features/folder/FolderPage"
import GroupPage from "../features/group/GroupPage"
import CompaniesPage from "../features/companies/CompaniesPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import { AuthRoutes } from "./AuthRoutes"
import LoginPage from "../features/login/LoginPage"
import { DevRoutes } from "./DevRoutes"
import { AdmRoutes } from "./AdmRoutes"
import UserPage from "../features/user/UserPage"
import SettingsPage from "../features/settings/SettingPage"
import IntegrationsPage from "../features/integrations/IntegrationsPage"
import ResetPassword from "../features/login/ResetPassword"
import ValidateRecoveryToken from "../features/login/ValidateRecoveryToken"
import RequestPasswordRecovery from "../features/login/RequestPasswordRecovery"
import TemplatePage from "../features/templates/TemplatePage"
import DocumentDetailsPage from "../features/documentdetails/DocumentDetailsPage"
import TaskBoardPage from "../features/task/TaskBoardPage"
import TaskDashboard from "../features/task/TaskDashboard"
import CascadeView from "../features/folder/CascadeView"
import ReportsPage from "../features/reports/ReportsPage"


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <AuthRoutes>
                    <LoginPage />
                </AuthRoutes>}
            />
            <Route path="/request-password-recovery" element={<RequestPasswordRecovery />} />
            <Route path="/validate-recovery-token" element={<ValidateRecoveryToken />} />
            <Route path="/reset-password" element={<ResetPassword />} />


            { }

            <Route path="/" element={
                <ProtectedRoutes>
                    <DashboardPage />
                </ProtectedRoutes>
            } />


            <Route path="/settings" element={
                <ProtectedRoutes>
                    <SettingsPage />
                </ProtectedRoutes>
            } />

            { }
            <Route path="/integrations/openai" element={
                <AdmRoutes>
                    <IntegrationsPage />
                </AdmRoutes>
            } />

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
                <ProtectedRoutes>
                    <GroupPage />
                </ProtectedRoutes>
            } />

            <Route path="/folder" element={
                <ProtectedRoutes>
                    <FolderPage />
                </ProtectedRoutes>
            } />

            <Route path="/task" element={
                <ProtectedRoutes>
                    <TaskPage />
                </ProtectedRoutes>
            } />

            <Route path="/document" element={
                <ProtectedRoutes>
                    <DocumentPage />
                </ProtectedRoutes>
            } />

            <Route path="/templates" element={
                <AdmRoutes>
                    <TemplatePage />
                </AdmRoutes>
            } />

            <Route path="/document/details/:id" element={
                <ProtectedRoutes>
                    <DocumentDetailsPage />
                </ProtectedRoutes>
            } />

            <Route path="/TaskBoardPage" element={
                <ProtectedRoutes>
                    <TaskBoardPage />
                </ProtectedRoutes>
            } />

            <Route path="/TaskDashboard" element={
                <ProtectedRoutes>
                    <TaskDashboard />
                </ProtectedRoutes>
            } />

            <Route path="/CascadeView" element={
                <ProtectedRoutes>
                    <CascadeView />
                </ProtectedRoutes>
            } />

            <Route path="/ReportsPage" element={
                <AdmRoutes>
                    <ReportsPage />
                </AdmRoutes>
            } />


            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}