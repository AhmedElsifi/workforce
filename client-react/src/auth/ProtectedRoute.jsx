import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
