import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/instance';

export const relocationsQueryKey = ['relocations'] as const;

export const useRelocations = () =>
  useQuery({
    queryKey: relocationsQueryKey,
    queryFn: async () => {
      const { data, error } = await api.GET('/relocations');
      if (error || !data) throw new Error('Не удалось загрузить решения');
      return data;
    },
  });
