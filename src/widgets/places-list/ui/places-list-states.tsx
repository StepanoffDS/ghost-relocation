import { AlertTriangle, Building2, RotateCcw } from 'lucide-react';

import { PlaceCard } from '@/entities/place';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/kit/alert';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';
import { Skeleton } from '@/shared/ui/kit/skeleton';

import type { PlacesViewProps } from '../types';

export function ReadyPlacesList({ places }: PlacesViewProps) {
  return (
    <ul
      className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'
      aria-label='Список мест переселения'
    >
      {places.data?.map((place) => (
        <li key={place.id}>
          <PlaceCard place={place} />
        </li>
      ))}
    </ul>
  );
}

export function PendingPlacesList() {
  return (
    <section
      className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'
      aria-busy='true'
      aria-label='Загрузка мест'
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} className='border-border/70 bg-card/75'>
          <CardHeader>
            <Skeleton className='h-5 w-36' />
            <Skeleton className='h-4 w-20' />
          </CardHeader>
          <CardContent className='space-y-3'>
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-16 w-full' />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function ErrorPlacesList({ places }: PlacesViewProps) {
  return (
    <Alert variant='destructive' className='max-w-xl p-4'>
      <AlertTriangle aria-hidden='true' />
      <AlertTitle>Не удалось загрузить места</AlertTitle>
      <AlertDescription>
        Проверьте подключение к mock API и повторите попытку.
      </AlertDescription>
      <Button
        className='mt-3'
        variant='outline'
        onClick={() => void places.refetch()}
      >
        <RotateCcw data-icon='inline-start' /> Повторить
      </Button>
    </Alert>
  );
}

export function EmptyPlacesList() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50 py-8 text-center'>
      <CardContent className='flex flex-col items-center gap-3'>
        <Building2 className='size-8 text-primary' aria-hidden='true' />
        <h3 className='text-base font-semibold'>Мест пока нет</h3>
        <p className='max-w-sm text-muted-foreground'>
          Выберите другой демо-набор или добавьте место в исходные данные.
        </p>
      </CardContent>
    </Card>
  );
}

export function FallbackPlacesList() {
  return (
    <Alert variant='destructive' className='max-w-xl p-4'>
      <AlertTriangle aria-hidden='true' />
      <AlertTitle>Неизвестная ошибка</AlertTitle>
      <AlertDescription>
        Обновите страницу. Если ошибка повторится, обратитесь к разработчику.
      </AlertDescription>
    </Alert>
  );
}
