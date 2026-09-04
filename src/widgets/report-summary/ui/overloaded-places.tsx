import type { ApiSchemas } from '@/shared/api/schema';
import { Badge } from '@/shared/ui/kit/badge';

import { EmptyState } from './report-states';

export function OverloadedPlaces({
  places,
}: {
  places: ApiSchemas['PlaceWithOccupancy'][];
}) {
  if (!places.length) {
    return <EmptyState>Перегруженных или заполненных мест нет.</EmptyState>;
  }

  return (
    <ul className='space-y-3'>
      {places.map((place) => (
        <li
          key={place.id}
          className='flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/60 p-3'
        >
          <span className='font-medium'>{place.name}</span>
          <span className='flex items-center gap-2 text-sm'>
            {place.occupied} / {place.capacity}
            <Badge variant={place.isOverloaded ? 'destructive' : 'outline'}>
              {place.isOverloaded ? 'Перегружено' : 'Заполнено'}
            </Badge>
          </span>
        </li>
      ))}
    </ul>
  );
}
