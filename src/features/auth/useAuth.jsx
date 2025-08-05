// hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getCurrentUser, 
  sendOtpToPhone, 
  signUpWithEmail, 
  loginWithEmail, 
  logout 
} from "../services/auth";

// -----------------------------
// 🔐 Get Current User Query
// -----------------------------
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// -----------------------------
// 📧 Email Signup Mutation
// -----------------------------
export function useSignUpWithEmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Email signup failed:", error.message);
    },
  });
}

// -----------------------------
// 📧 Email Login Mutation
// -----------------------------
export function useLoginWithEmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loginWithEmail,
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Email login failed:", error.message);
    },
  });
}

// -----------------------------
// 🚪 Logout Mutation
// -----------------------------
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });
}