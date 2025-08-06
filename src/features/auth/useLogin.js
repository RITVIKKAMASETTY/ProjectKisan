import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/index';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (user) => {
      toast.success('Login successful!');
      queryClient.setQueryData(['user'], user); // Update user cache
      if (user.role === 'farmer') {
        navigate('/');
      } else if (user.role === 'buyer') {
        navigate('/');
      } else {
        toast.error('Invalid user role');
      }
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
}