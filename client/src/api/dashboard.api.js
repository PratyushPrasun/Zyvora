import api from '@/lib/axios';

export const getDashboard = () => api.get('/admin/dashboard');
