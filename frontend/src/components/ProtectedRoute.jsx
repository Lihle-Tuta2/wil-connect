import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;