import { AlertTriangle, Ghost, RotateCcw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/kit/alert';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';
import { Skeleton } from '@/shared/ui/kit/skeleton';

export function PendingBoard() {
  return (
    <section
      className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'
      aria-busy='true'
      aria-label='Загрузка заявок'
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} className='border-border/70 bg-card/75'>
          <CardHeader>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-4 w-40' />
          </CardHeader>
          <CardContent className='space-y-3'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-8 w-3/4' />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function ErrorBoard({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant='destructive' className='max-w-xl p-4'>
      <AlertTriangle aria-hidden='true' />
      <AlertTitle>Не удалось загрузить заявки</AlertTitle>
      <AlertDescription>
        Проверьте подключение к mock API и повторите попытку.
      </AlertDescription>
      <Button
        className='mt-3'
        variant='outline'
        onClick={onRetry}
      >
        <RotateCcw data-icon='inline-start' /> Повторить
      </Button>
    </Alert>
  );
}

export function EmptyBoard() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50 py-8 text-center'>
      <CardContent className='flex flex-col items-center gap-3'>
        <Ghost className='size-8 text-primary' aria-hidden='true' />
        <h3 className='text-base font-semibold'>Заявок пока нет</h3>
        <p className='max-w-sm text-muted-foreground'>
          Выберите другой демо-набор или дождитесь новых обращений.
        </p>
      </CardContent>
    </Card>
  );
}
