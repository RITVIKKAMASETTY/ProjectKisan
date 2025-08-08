import { useUser } from "../features/auth/useUser"; // Corrected path
import Loder from "../ui/Loder"; // Corrected typo from Loder to Loader
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated, error } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loder />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return null; // Navigation handled by useEffect
}

export default ProtectedRoute;