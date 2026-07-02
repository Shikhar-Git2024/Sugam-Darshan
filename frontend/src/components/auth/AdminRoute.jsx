import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("AdminRoute: Corrupted session cleaned.", error);
    localStorage.removeItem("user");
    user = null;
  }

  // If no token exists, bounce back to the corresponding login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Enforce rigid verification against the target role domain
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}