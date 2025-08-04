// hooks/useVerifyOtp.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

// -----------------------------
// 🔢 Verify OTP Function
// -----------------------------
async function verifyOtp({ phone, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });
  
  if (error) throw new Error("Invalid OTP or OTP expired");
  return data.user;
}

// -----------------------------
// 🔢 Verify OTP Mutation Hook
// -----------------------------
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("OTP verification failed:", error.message);
    },
  });
}