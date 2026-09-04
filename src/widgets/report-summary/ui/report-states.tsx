import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/kit/alert';
import { Button } from '@/shared/ui/kit/button';
import { Skeleton } from '@/shared/ui/kit/skeleton';

export function PendingReport() {
  return (
    <section
      className='space-y-8'
      aria-busy='true'
      aria-label='Загрузка отчёта'
    >
      <div className='grid gap-4 sm:grid-cols-3'>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className='h-28' />
        ))}
      </div>
      <Skeleton className='h-48' />
      <Skeleton className='h-40' />
    </section>
  );
}

export function ErrorReport({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant='destructive' className='max-w-xl p-4'>
      <AlertTriangle aria-hidden='true' />
      <AlertTitle>Не удалось загрузить отчёт</AlertTitle>
      <AlertDescription>
        Проверьте подключение к mock API и повторите попытку.
      </AlertDescription>
      <Button className='mt-3' variant='outline' onClick={onRetry}>
        <RotateCcw data-icon='inline-start' /> Повторить
      </Button>
    </Alert>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className='text-sm text-muted-foreground'>{children}</p>;
}
