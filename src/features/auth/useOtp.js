// features/auth/useOtp.js
import { useMutation } from "@tanstack/react-query";
import { sendOtpToPhone } from "../../api/auth";
import toast from "react-hot-toast";

export function useOtp() {
  const { mutate: sendOtp, isPending } = useMutation({
    mutationFn: (phone) => sendOtpToPhone(phone),
    onSuccess: () => {
      toast.success("OTP sent successfully! Check your phone.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { sendOtp, isPending };
}