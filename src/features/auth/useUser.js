// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getProfile } from "../../api/auth"; // Adjusted to match auth.js
// import { useEffect } from "react";
// import supabase from "../../api/supabase";
// import { supabaseUrl } from "../../api/supabase";
// export function useUser() {
//   const queryClient = useQueryClient();

//   const { data: user, isLoading, error } = useQuery({
//     queryKey: ["user"],
//     queryFn: getProfile,
//     retry: false,
//   });

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
//         queryClient.invalidateQueries(["user"]);
//       }
//     });

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, [queryClient]);

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     error,
//   };
// }
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../api/auth";
import { useEffect } from "react";
import supabase from "../../api/supabase";

export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
      queryClient.invalidateQueries(["user"]);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    user, // contains { role: "..." }
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
