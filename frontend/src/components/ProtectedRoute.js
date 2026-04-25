import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // Logged in → allow access
  return children;
}

export default ProtectedRoute;
