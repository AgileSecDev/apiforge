import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import WorkspacePage from "./features/workspace/pages/WorkspacePage.jsx";
import { getSession } from "./features/auth/api/authApi.js";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getSession()?.access) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function GuestRoute({ children }) {
  return getSession()?.access ? <Navigate to="/app" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
