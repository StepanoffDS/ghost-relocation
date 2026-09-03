import { Sparkles } from 'lucide-react';

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
          Проверьте условия переселения, прежде чем подбирать новое место.
        </p>
      </header>
      <RelocationBoard />
    </section>
  );
}

export const Component = RelocationPage;
