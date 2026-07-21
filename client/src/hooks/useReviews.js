import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '@/api/reviews.api';
import { productKeys } from './useProducts';
import { toast } from 'sonner';

export const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (productId) => [...reviewKeys.lists(), productId],
};

export const useReviews = (productId) => {
  return useQuery({
    queryKey: reviewKeys.list(productId),
    queryFn: () => reviewsApi.getReviews(productId),
    select: (res) => res.data,
    enabled: !!productId,
  });
};

export const useAddReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewsApi.addReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      toast.success('Review added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });
};

export const useUpdateReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewsApi.updateReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      toast.success('Review updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    },
  });
};

export const useDeleteReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reviewsApi.deleteReview(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};
