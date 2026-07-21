import api from '@/lib/axios';

export const getCart = () => api.get('/cart');

export const addToCart = (data) => api.post('/cart', data);

export const updateCartItem = (productId, data) =>
  api.put(`/cart/${productId}`, data);

export const removeCartItem = (productId) =>
  api.delete(`/cart/${productId}`);

export const clearCart = () => api.delete('/cart');
