import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersApi from '@/api/orders.api';
import { toast } from 'sonner';
import { cartKeys } from './useCart';

export const orderKeys = {
  all: ['orders'],
  myOrders: () => [...orderKeys.all, 'my'],
  detail: (id) => [...orderKeys.all, 'detail', id],
  adminAll: () => [...orderKeys.all, 'admin'],
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: () => ordersApi.getMyOrders(),
    select: (res) => res.data,
  });
};

export const useOrderById = (id) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: orderKeys.adminAll(),
    queryFn: () => ordersApi.getAllOrders(),
    select: (res) => res.data,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, orderStatus }) =>
      ordersApi.updateOrderStatus(id, { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to update order status'
      );
    },
  });
};
