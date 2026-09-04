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

type ManualRelocationInput = {
  ghostId: string;
  placeId: string;
  force: boolean;
};

export class ManualRelocationConflictError extends Error {
  readonly issues: ApiSchemas['RelocationIssue'][];

  constructor(issues: ApiSchemas['RelocationIssue'][]) {
    super('Выбранное место нарушает условия заявки');
    this.issues = issues;
  }
}

export const useManualRelocation = () =>
  useMutation({
    mutationFn: async ({ ghostId, placeId, force }: ManualRelocationInput) => {
      const { data, error } = await api.PUT('/relocations/{ghostId}', {
        params: { path: { ghostId } },
        body: { placeId, force },
      });
      if (data) return data;

      if (error?.error.code === 'RELOCATION_CONFLICT') {
        const details = error.error.details as {
          issues?: ApiSchemas['RelocationIssue'][];
        };
        throw new ManualRelocationConflictError(details.issues ?? []);
      }

      throw new Error(error?.error.message ?? 'Не удалось изменить место');
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ghostsQueryKey }),
        queryClient.invalidateQueries({ queryKey: placesQueryKey }),
        queryClient.invalidateQueries({ queryKey: relocationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: relocationReportQueryKey }),
      ]),
  });
