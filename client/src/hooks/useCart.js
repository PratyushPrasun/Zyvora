import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from '@/api/cart.api';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';

export const cartKeys = {
  all: ['cart'],
  detail: () => [...cartKeys.all, 'detail'],
};

export const useCart = () => {
  const { isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartApi.getCart(),
    select: (res) => res.data.cart,
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Added to cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartApi.updateCartItem(productId, { quantity }),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const previous = queryClient.getQueryData(cartKeys.detail());

      queryClient.setQueryData(cartKeys.detail(), (old) => {
        if (!old) return old;
        const cart = old.data?.cart || old;
        return {
          ...cart,
          items: cart.items?.map((item) =>
            (item.product?._id || item.product) === productId
              ? { ...item, quantity }
              : item
          ),
        };
      });

      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.detail(), context.previous);
      }
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => cartApi.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Removed from cart');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to remove from cart'
      );
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Cart cleared');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
  });
};
