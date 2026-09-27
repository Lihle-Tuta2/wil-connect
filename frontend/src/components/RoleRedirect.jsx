import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function RoleRedirect() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "Student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (user.role === "Employer") {
    return <Navigate to="/employer/dashboard" replace />;
  }

  if (user.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

export default RoleRedirect;