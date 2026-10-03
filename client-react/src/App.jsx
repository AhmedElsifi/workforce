import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./auth/useAuth";
import RoleRoute from "./auth/RoleRoute";
import AppLayout from "./components/layout/AppLayout";
import Spinner from "./components/ui/Spinner";

import LoginPage from "./pages/auth/LoginPage";
import SessionExpiredPage from "./pages/auth/SessionExpiredPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEmployeesPage from "./pages/admin/AdminEmployeesPage";
import AdminDepartmentsPage from "./pages/admin/AdminDepartmentsPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerEmployeesPage from "./pages/manager/ManagerEmployeesPage";
import ManagerLeaveRequestsPage from "./pages/manager/ManagerLeaveRequestsPage";
import ManagerAttendancePage from "./pages/manager/ManagerAttendancePage";
import ManagerProfilePage from "./pages/manager/ManagerProfilePage";

import EmployeeDashboardPage from "./pages/employee/EmployeeDashboardPage";
import EmployeeAttendancePage from "./pages/employee/EmployeeAttendancePage";
import EmployeeLeaveRequestsPage from "./pages/employee/EmployeeLeaveRequestsPage";
import EmployeeProfilePage from "./pages/employee/EmployeeProfilePage";

import MarketingLandingPage from "./pages/marketing/MarketingLandingPage";

function RoleHome() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="page-loader">
        <Spinner />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "manager")
    return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<RoleHome />} />
        <Route path="/marketing" element={<MarketingLandingPage />} />
        <Route path="/auth/session-expired" element={<SessionExpiredPage />} />
        <Route path="/auth/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <AppLayout role="admin" />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="employees" element={<AdminEmployeesPage />} />
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <RoleRoute roles={["manager"]}>
              <AppLayout role="manager" />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="employees" element={<ManagerEmployeesPage />} />
          <Route path="leave-requests" element={<ManagerLeaveRequestsPage />} />
          <Route path="attendance" element={<ManagerAttendancePage />} />
          <Route path="profile" element={<ManagerProfilePage />} />
        </Route>

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <RoleRoute roles={["employee"]}>
              <AppLayout role="employee" />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="attendance" element={<EmployeeAttendancePage />} />
          <Route
            path="leave-requests"
            element={<EmployeeLeaveRequestsPage />}
          />
          <Route path="profile" element={<EmployeeProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
