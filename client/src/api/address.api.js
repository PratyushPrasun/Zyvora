import api from '@/lib/axios';

export const getMyAddresses = () => api.get('/api/address');

export const getAddressById = (id) => api.get(`/api/address/${id}`);

export const addAddress = (data) => api.post('/api/address', data);

export const updateAddress = (id, data) => api.put(`/api/address/${id}`, data);

export const deleteAddress = (id) => api.delete(`/api/address/${id}`);

export const setDefaultAddress = (id) => api.patch(`/api/address/${id}/default`);
