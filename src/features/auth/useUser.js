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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, listenToAuthChanges } from "../../services/auth";
import { useEffect } from "react";

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}