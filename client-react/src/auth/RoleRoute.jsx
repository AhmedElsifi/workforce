import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../components/ui/Spinner";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (!roles.includes(user.role)) {
    return <Navigate to="/auth/unauthorized" replace />;
  }

  return children;
}
