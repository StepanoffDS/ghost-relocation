import { useMutation } from '@tanstack/react-query';

import { ghostsQueryKey } from '@/entities/ghost';
import { placesQueryKey } from '@/entities/place';
import {
  relocationReportQueryKey,
  relocationsQueryKey,
} from '@/entities/relocation';
import { api } from '@/shared/api/instance';
import { queryClient } from '@/shared/api/query-client';
import type { ApiSchemas } from '@/shared/api/schema';

export const useDemoReset = () =>
  useMutation({
    mutationFn: async (fixture: ApiSchemas['DemoFixture']) => {
      const { data, error } = await api.POST('/demo/reset', {
        body: { fixture },
      });
      if (error || !data) throw new Error('Не удалось сменить демо-набор');
      return data;
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ghostsQueryKey }),
        queryClient.invalidateQueries({ queryKey: placesQueryKey }),
        queryClient.invalidateQueries({ queryKey: relocationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: relocationReportQueryKey }),
      ]),
  });
