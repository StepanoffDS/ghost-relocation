import type { ApiSchemas } from '@/shared/api/schema';

import { EmptyState } from './report-states';

export function ManualWarnings({
  relocations,
}: {
  relocations: ApiSchemas['RelocationReport']['manualWarnings'];
}) {
  if (!relocations.length) {
    return <EmptyState>Ручных решений с предупреждениями нет.</EmptyState>;
  }

  return (
    <ul className='space-y-3'>
      {relocations.map((relocation) => (
        <li key={relocation.ghostId} className='rounded-md bg-muted/60 p-3'>
          <p className='font-medium'>Ручное решение</p>
          <ul className='mt-2 space-y-1 text-sm text-muted-foreground'>
            {relocation.issues.map((issue) => (
              <li key={issue.code}>{issue.message}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
