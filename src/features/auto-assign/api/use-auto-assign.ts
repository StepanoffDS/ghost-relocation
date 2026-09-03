import { useMutation } from '@tanstack/react-query';

import { ghostsQueryKey } from '@/entities/ghost';
import { placesQueryKey } from '@/entities/place';
import { relocationsQueryKey } from '@/entities/relocation';
import { api } from '@/shared/api/instance';
import { queryClient } from '@/shared/api/query-client';

export const useAutoAssign = () =>
  useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST('/relocations/auto-assign');
      if (error || !data) throw new Error('Не удалось распределить заявки');
      return data;
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ghostsQueryKey }),
        queryClient.invalidateQueries({ queryKey: placesQueryKey }),
        queryClient.invalidateQueries({ queryKey: relocationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ['report'] }),
      ]),
  });
