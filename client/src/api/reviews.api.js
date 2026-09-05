import api from '@/lib/axios';

export const getReviews = (productId) =>
  api.get(`/api/products/${productId}/reviews`);

export const addReview = (productId, data) =>
  api.post(`/api/products/${productId}/reviews`, data);

export const updateReview = (productId, data) =>
  api.put(`/api/products/${productId}/reviews`, data);

export const deleteReview = (productId) =>
  api.delete(`/api/products/${productId}/reviews`);
