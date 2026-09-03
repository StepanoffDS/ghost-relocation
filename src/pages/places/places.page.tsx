import { Building2 } from 'lucide-react';

import { PlacesList } from '@/widgets/places-list';

export function PlacesPage() {
  return (
    <section className='space-y-8'>
      <header className='max-w-2xl'>
        <p className='mb-3 flex items-center gap-2 text-sm font-medium text-primary'>
          <Building2 className='size-4' aria-hidden='true' /> Фонд переселения
        </p>
        <h2 className='text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
          Места переселения
        </h2>
        <p className='mt-3 text-base leading-7 text-muted-foreground'>
          Оцените условия и свободную вместимость, прежде чем принимать решение.
        </p>
      </header>
      <PlacesList />
    </section>
  );
}

export const Component = PlacesPage;
