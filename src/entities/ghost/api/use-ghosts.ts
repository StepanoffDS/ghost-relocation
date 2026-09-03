import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/instance';

export const ghostsQueryKey = ['ghosts'] as const;

export const useGhosts = () =>
  useQuery({
    queryKey: ghostsQueryKey,
    queryFn: async () => {
      const { data, error } = await api.GET('/ghosts');
      if (error || !data) throw new Error('Не удалось загрузить заявки');
      return data;
    },
  });
