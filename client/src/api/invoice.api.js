import api from '@/lib/axios';

export const getInvoiceByOrder = (orderId) =>
  api.get(`/api/invoices/order/${orderId}`);

export const downloadInvoice = (orderId) =>
  api.get(`/api/invoices/download/${orderId}`, {
    responseType: 'blob',
  });
