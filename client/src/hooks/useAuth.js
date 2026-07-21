import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '@/api/auth.api';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: ({ data }) => {
      login(data.user, data.token);
      toast.success('Welcome back!');
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: ({ data }) => {
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};
