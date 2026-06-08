import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Common/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AttendancePage from './pages/AttendancePage'
import EmployeesPage from './pages/EmployeesPage'
import LeavePage from './pages/LeavePage'
import PayrollPage from './pages/PayrollPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PerformancePage from './pages/PerformancePage'
import RecruitmentPage from './pages/RecruitmentPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="attendance"  element={<AttendancePage />} />
        <Route path="employees"   element={<EmployeesPage />} />
        <Route path="leave"       element={<LeavePage />} />
        <Route path="payroll"     element={<PayrollPage />} />
        <Route path="analytics"   element={<AnalyticsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="recruitment" element={<RecruitmentPage />} />
        <Route path="profile"     element={<ProfilePage />} />
        <Route path="settings"    element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
