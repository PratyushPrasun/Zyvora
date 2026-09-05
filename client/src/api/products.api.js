import api from '@/lib/axios';

export const getProducts = (params) => api.get('/api/products', { params });

export const getCategories = () => api.get('/api/products/categories');

export const getProductById = (id) => api.get(`/api/products/${id}`);

export const addProduct = (formData) =>
  api.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  api.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
