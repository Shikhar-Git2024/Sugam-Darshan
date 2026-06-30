import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch {
    localStorage.removeItem("user");
    user = null;
  }

  // If no token exists, send them explicitly to the devotee login page
  if (!token) {
    return <Navigate to="/devotee/login" replace />;
  }

  // Enforce strict devotee role matching
  if (!user || user.role !== "DEVOTEE") {
    return <Navigate to="/" replace />;
  }

  return children;
}