import api from '@/lib/axios';

export const getInvoiceByOrder = (orderId) =>
  api.get(`/invoices/order/${orderId}`);

export const downloadInvoice = (orderId) =>
  api.get(`/invoices/download/${orderId}`, {
    responseType: 'blob',
  });
