import api from '@/lib/axios';

export const getCart = () => api.get('/api/cart');

export const addToCart = (data) => api.post('/api/cart', data);

export const updateCartItem = (productId, data) =>
  api.put(`/api/cart/${productId}`, data);

export const removeCartItem = (productId) =>
  api.delete(`/api/cart/${productId}`);

export const clearCart = () => api.delete('/api/cart');
