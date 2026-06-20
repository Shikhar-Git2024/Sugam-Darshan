import { Navigate } from "react-router-dom";

export default function AuthorityRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!token) {
    return (
      <Navigate
        to="/authority/login"
        replace
      />
    );
  }

  if (
    !user ||
    user.role !== "AUTHORITY"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}