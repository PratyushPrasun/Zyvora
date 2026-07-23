import api from '@/lib/axios';

export const getAuditLogs = (params = {}) => {
  return api.get('/admin/audit-logs', { params });
};
