import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as addressApi from '@/api/address.api';
import { toast } from 'sonner';

export const addressKeys = {
  all: ['addresses'],
  list: () => [...addressKeys.all, 'list'],
  detail: (id) => [...addressKeys.all, 'detail', id],
};

export const useAddresses = () => {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: () => addressApi.getMyAddresses(),
    select: (res) => res.data,
  });
};

export const useAddressById = (id) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressApi.getAddressById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addressApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add address');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => addressApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update address');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => addressApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Default address updated');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to set default address'
      );
    },
  });
};
