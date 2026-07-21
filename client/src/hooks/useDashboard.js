import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/api/dashboard.api';

export const dashboardKeys = {
  all: ['dashboard'],
  data: () => [...dashboardKeys.all, 'data'],
};

export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => getDashboard(),
    select: (res) => res.data.dashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
