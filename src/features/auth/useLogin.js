import { useMutation } from "@tanstack/react-query";
import { loginWithEmail } from "../../services/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginWithEmail({ email, password }),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.email}!`);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login mutation error:", error.message);
      toast.error(`Login failed: ${error.message}`);
    },
  });

  return { login, isPending };
}