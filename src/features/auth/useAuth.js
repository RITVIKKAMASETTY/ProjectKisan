import { useMutation, useQuery } from '@tanstack/react-query';
import {getCurrentUser,login,logout,signup} from "../../api/auth.js";

export const useAuth = () => {
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => console.log('Signup successful'),
    onError: (error) => console.error('Signup failed:', error.message)
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => console.log('Login successful'),
    onError: (error) => console.error('Login failed:', error.message)
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => console.log('Logout successful'),
    onError: (error) => console.error('Logout failed:', error.message)
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser
  });

  return {
    signup: signupMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    user,
    isUserLoading
  };
};