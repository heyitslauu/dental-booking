import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../../features/admin/auth";

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />;
  }

  return children;
}
