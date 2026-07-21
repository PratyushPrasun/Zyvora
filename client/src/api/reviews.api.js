import api from '@/lib/axios';

export const getReviews = (productId) =>
  api.get(`/products/${productId}/reviews`);

export const addReview = (productId, data) =>
  api.post(`/products/${productId}/reviews`, data);

export const updateReview = (productId, data) =>
  api.put(`/products/${productId}/reviews`, data);

export const deleteReview = (productId) =>
  api.delete(`/products/${productId}/reviews`);
