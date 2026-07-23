import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit.api';

export const auditLogKeys = {
  all: ['audit-logs'],
  lists: () => [...auditLogKeys.all, 'list'],
  list: (params) => [...auditLogKeys.lists(), params],
};

export const useAuditLogs = (params = {}) => {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => getAuditLogs(params),
    select: (res) => res.data,
    staleTime: 30000,
  });
};
