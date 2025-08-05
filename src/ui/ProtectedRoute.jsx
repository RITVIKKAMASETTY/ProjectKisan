import { useUser } from "../features/auth/useUser";
import Loder from "./Loder";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      console.log("ProtectedRoute: Not authenticated, redirecting to /login");
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    console.log("ProtectedRoute: Loading user state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loder />
      </div>
    );
  }

  if (isAuthenticated) {
    console.log("ProtectedRoute: User authenticated, rendering children");
    return children;
  }

  return null; // Navigation handled by useEffect
}

export default ProtectedRoute;