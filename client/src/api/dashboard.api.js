import api from '@/lib/axios';

export const getDashboard = () => api.get('/api/admin/dashboard');
