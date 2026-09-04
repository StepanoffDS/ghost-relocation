import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/instance';

export const relocationReportQueryKey = ['report'] as const;

export const useRelocationReport = () =>
  useQuery({
    queryKey: relocationReportQueryKey,
    queryFn: async () => {
      const { data, error } = await api.GET('/reports/relocation');
      if (error || !data) throw new Error('Не удалось загрузить отчёт');
      return data;
    },
  });
