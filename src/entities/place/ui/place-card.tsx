import { Building2, Users } from 'lucide-react';

import type { ApiSchemas } from '@/shared/api/schema';
import { Badge } from '@/shared/ui/kit/badge';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';

import {
  getPlaceDetails,
  getPlaceFeatures,
  getPlaceStatus,
  getPlaceType,
} from '../model/place-details';

type PlaceCardProps = { place: ApiSchemas['PlaceWithOccupancy'] };

const statuses = {
  available: { label: 'Свободно', variant: 'secondary' },
  full: { label: 'Заполнено', variant: 'outline' },
  overloaded: { label: 'Перегружено', variant: 'destructive' },
} as const;

export function PlaceCard({ place }: PlaceCardProps) {
  const status = getPlaceStatus(place);

  return (
    <Card className='h-full border-border/70 bg-card/75 transition-colors hover:border-primary/45 hover:bg-card'>
      <CardHeader className='flex-row items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-semibold tracking-tight'>{place.name}</h3>
          <p className='mt-1 flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Building2 className='size-3.5 text-primary' aria-hidden='true' />{' '}
            {getPlaceType(place.type)}
          </p>
        </div>
        <Badge variant={statuses[status].variant}>
          {statuses[status].label}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='rounded-md bg-muted/60 p-3'>
          <p className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
            <Users className='size-3.5 text-primary' aria-hidden='true' />{' '}
            Вместимость
          </p>
          <p className='mt-1 text-xl font-semibold'>
            {place.occupied} / {place.capacity}
          </p>
        </div>
        <dl className='grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
          {getPlaceDetails(place).map(([label, value]) => (
            <div key={label}>
              <dt className='text-xs text-muted-foreground'>{label}</dt>
              <dd className='mt-0.5'>{value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className='mb-2 text-xs font-medium text-muted-foreground'>
            Особенности
          </p>
          <ul
            className='flex flex-wrap gap-1.5'
            aria-label={`Особенности места ${place.name}`}
          >
            {[...getPlaceFeatures(place), ...place.restrictions].map(
              (feature) => (
                <li key={feature}>
                  <Badge variant='outline'>{feature}</Badge>
                </li>
              ),
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
