import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/instance';

export const placesQueryKey = ['places'] as const;

export const usePlaces = () =>
  useQuery({
    queryKey: placesQueryKey,
    queryFn: async () => {
      const { data, error } = await api.GET('/places');
      if (error || !data) throw new Error('Не удалось загрузить места');
      return data;
    },
  });
