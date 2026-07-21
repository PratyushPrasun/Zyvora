import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsApi from '@/api/payments.api';
import { toast } from 'sonner';
import { orderKeys } from './useOrders';
import { cartKeys } from './useCart';

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (data) => paymentsApi.createPaymentOrder(data),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to create payment order'
      );
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentsApi.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Payment verification failed'
      );
    },
  });
};
