// // features/auth/useUser.js
// import { useQuery } from "@tanstack/react-query";
// import { getCurrentUser } from "../../services/auth";

// export function useUser() {
//   const { data: user, isLoading, error } = useQuery({
//     queryKey: ["user"],
//     queryFn: getCurrentUser,
//     retry: false,
//     refetchOnWindowFocus: false,
//   });

//   return {
//     user,
//     isLoading,
//     isAuthenticated: Boolean(user),
//     error,
//   };
// }
import { useState, useEffect } from "react";
import { getCurrentUser, listenToAuthChanges } from "../../services/auth";

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initial fetch of current user
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();

    // Listen for auth state changes
    const { subscription } = listenToAuthChanges((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe();
  }, []);

  return { user, isLoading, isAuthenticated };
}