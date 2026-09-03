import { Sparkles } from 'lucide-react';

import { AutoAssignButton } from '@/features/auto-assign';
import { RelocationBoard } from '@/widgets/relocation-board';

export function RelocationPage() {
  return (
    <section className='space-y-8'>
      <header className='max-w-2xl'>
        <p className='mb-3 flex items-center gap-2 text-sm font-medium text-primary'>
          <Sparkles className='size-4' aria-hidden='true' /> Очередь на
          переселение
        </p>
        <h2 className='text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
          Заявки от привидений
        </h2>
        <p className='mt-3 text-base leading-7 text-muted-foreground'>
          Подбор исключает конфликтные места и оценивает температуру, свет, шум,
          влажность и вместимость.
        </p>
      </header>
      <AutoAssignButton />
      <RelocationBoard />
    </section>
  );
}

export const Component = RelocationPage;
