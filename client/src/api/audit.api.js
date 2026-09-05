import api from '@/lib/axios';

export const getAuditLogs = (params = {}) => {
  return api.get('/api/admin/audit-logs', { params });
};
