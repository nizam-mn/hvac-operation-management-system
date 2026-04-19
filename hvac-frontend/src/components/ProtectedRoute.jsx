import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const rolePermissions = {
  marketing: ["/leads", "/quotations", "/profile"],
  sales: ["/leads", "/quotations", "/profile"],
  project: ["/projects", "/quotations", "/profile"],
  finance: ["/projects", "/quotations", "/profile", "/invoices"],
};

export default function ProtectedRoute({ children, protect = true }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (protect && !user) {
    return <Navigate to="/login" />;
  }

  if (!protect && user) {
    return <Navigate to="/" />;
  }

  // 🔓 Admin can access everything
  if (user?.role === "admin") {
    return children;
  }

  // ✅ Role-based restriction
  if (user) {
    const allowedRoutes = rolePermissions[user.role] || [];

    const isAllowed = allowedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (!isAllowed) {
      return <Navigate to={allowedRoutes[0] || "/"} />;
    }
  }

  return children;
}