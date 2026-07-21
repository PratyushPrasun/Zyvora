import api from '@/lib/axios';

export const createOrder = (data) => api.post('/orders', data);

export const getMyOrders = () => api.get('/orders/my-orders');

export const getOrderById = (id) => api.get(`/orders/my-orders/${id}`);

export const getAllOrders = () => api.get('/orders');

export const updateOrderStatus = (id, data) =>
  api.patch(`/orders/${id}/status`, data);
