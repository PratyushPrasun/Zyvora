import api from '@/lib/axios';

export const createPaymentOrder = (data) =>
  api.post('/api/payments/create-order', data);

export const verifyPayment = (data) =>
  api.post('/api/payments/verify', data);
