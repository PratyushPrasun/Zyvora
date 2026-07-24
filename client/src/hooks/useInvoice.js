import { useQuery, useMutation } from '@tanstack/react-query';
import * as invoiceApi from '@/api/invoice.api';
import { toast } from 'sonner';

export const invoiceKeys = {
  all: ['invoices'],
  byOrder: (orderId) => [...invoiceKeys.all, 'order', orderId],
};

/**
 * Fetch invoice metadata for a given order.
 */
export const useInvoiceByOrder = (orderId) => {
  return useQuery({
    queryKey: invoiceKeys.byOrder(orderId),
    queryFn: () => invoiceApi.getInvoiceByOrder(orderId),
    select: (res) => res.data,
    enabled: !!orderId,
    retry: false,
    // Don't show error — invoice might not exist yet
    meta: { silent: true },
  });
};

/**
 * Download invoice PDF as a blob and trigger browser save.
 *
 * Returns a mutation that:
 * 1. Fetches the PDF blob from the API
 * 2. Creates a temporary object URL
 * 3. Triggers a browser download
 * 4. Cleans up the URL
 */
export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await invoiceApi.downloadInvoice(orderId);
      return { data: response.data, orderId };
    },
    onSuccess: ({ data, orderId }) => {
      // Create blob URL and trigger download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded successfully!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to download invoice';
      toast.error(message);
    },
  });
};
