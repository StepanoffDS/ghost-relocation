import type { ApiSchemas } from '@/shared/api/schema';

import { EmptyState } from './report-states';

export function ProblematicGhosts({
  ghosts,
}: {
  ghosts: ApiSchemas['RelocationReport']['problematicGhosts'];
}) {
  if (!ghosts.length) {
    return <EmptyState>Критических ограничений пока нет.</EmptyState>;
  }

  return (
    <ul className='space-y-3'>
      {ghosts.map((ghost) => (
        <li key={ghost.ghostId} className='rounded-md bg-muted/60 p-3'>
          <p className='font-medium'>{ghost.name}</p>
          <ul className='mt-2 space-y-1 text-sm text-muted-foreground'>
            {ghost.issues.map((issue) => (
              <li key={issue.code}>{issue.message}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
