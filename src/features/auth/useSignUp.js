import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/index';
import { toast } from 'react-hot-toast';

export function useSignUp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, phone, password, name, role, location, profile_data }) =>
      register({ email, phone, password, name, role, location, profile_data }),
    onSuccess: (user) => {
      toast.success('Sign-up successful!');
      queryClient.setQueryData(['user'], user); // Update user cache
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'buyer') {
        navigate('/buyer/dashboard');
      } else {
        toast.error('Invalid user role');
      }
    },
    onError: (error) => {
      toast.error(`Sign-up failed: ${error.message}`);
    },
  });
}