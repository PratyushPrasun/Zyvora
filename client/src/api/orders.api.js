import api from '@/lib/axios';

export const createOrder = (data) => api.post('/api/orders', data);

export const getMyOrders = () => api.get('/api/orders/my-orders');

export const getOrderById = (id) => api.get(`/api/orders/my-orders/${id}`);

export const getAllOrders = () => api.get('/api/orders');

export const updateOrderStatus = (id, data) =>
  api.patch(`/api/orders/${id}/status`, data);
