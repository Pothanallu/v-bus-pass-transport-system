import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* =========================
   Pages
========================= */
import TOLogin from "./pages/TOLogin";
import TOHome from "./pages/TOHome";
import StudentPass from "./pages/StudentPassManagement";
import DigitalBusPass from "./pages/DigitalBusPass";
import BusManagement from "./pages/BusManagement";
import Driverworker from "./pages/DriverWorkers";
import FuelManagement from "./pages/FuelMaintenanceManagement";
import FinanceManagement from "./pages/FinanceManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";

/* =========================
   Route Guard
========================= */
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import ManageAccount from "./components/ManageAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
           Default Redirect
        ========================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =========================
           Public Route
        ========================= */}
        <Route path="/login" element={<TOLogin />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-account" element={<ManageAccount />} />

        {/* =========================
           Protected Dashboard
        ========================= */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <TOHome />
            </ProtectedRoute>
          }
        />

        {/* =========================
           Student Bus Pass Module
        ========================= */}
        <Route
          path="/student-pass"
          element={
            <ProtectedRoute>
              <StudentPass />
            </ProtectedRoute>
          }
        />

        {/* =========================
           Digital Bus Pass (View / Print)
        ========================= */}
        <Route
          path="/digital-pass/:passId"
          element={
            <ProtectedRoute>
              <DigitalBusPass />
            </ProtectedRoute>
          }
        />

        {/* =========================
           Transport Officer Modules
        ========================= */}
        <Route
          path="/transport-management"
          element={
            <ProtectedRoute>
              <BusManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-management"
          element={
            <ProtectedRoute>
              <Driverworker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fuel-maintenance"
          element={
            <ProtectedRoute>
              <FuelManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsAnalytics />
            </ProtectedRoute>
          }
        />

        {/* =========================
           Fallback
        ========================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
