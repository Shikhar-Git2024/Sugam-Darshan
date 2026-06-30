import { Navigate } from "react-router-dom";

export default function AuthorityRoute({ children }) {
  const token = localStorage.getItem("token");
  
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("AuthorityRoute: Corrupted session cleaned.", error);
    localStorage.removeItem("user");
    user = null;
  }

  // If no token exists, bounce back to the corresponding login page
  if (!token) {
    return <Navigate to="/authority/login" replace />;
  }

  // Enforce rigid verification against the target role domain
  if (!user || user.role !== "AUTHORITY") {
    return <Navigate to="/" replace />;
  }

  return children;
}