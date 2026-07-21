import api from '@/lib/axios';

export const getMyAddresses = () => api.get('/address');

export const getAddressById = (id) => api.get(`/address/${id}`);

export const addAddress = (data) => api.post('/address', data);

export const updateAddress = (id, data) => api.put(`/address/${id}`, data);

export const deleteAddress = (id) => api.delete(`/address/${id}`);

export const setDefaultAddress = (id) => api.patch(`/address/${id}/default`);
