// features/auth/useSignup.js
import { useMutation } from "@tanstack/react-query";
import { signUpWithEmail } from "../../services/auth";
import toast from "react-hot-toast";

export function useSignUp() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: ({ email, password }) => signUpWithEmail({ email, password }),
    onSuccess: (user) => {
      toast.success(`Account created successfully! Check your email to verify your account.`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { signup, isPending };
}