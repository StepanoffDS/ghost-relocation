import { CalendarDays, Thermometer, Waves } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ApiSchemas } from '@/shared/api/schema';
import { Badge } from '@/shared/ui/kit/badge';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';

import {
  formatGhostDeadline,
  getGhostRequirements,
} from '../model/ghost-application-details';

type GhostApplicationCardProps = {
  ghost: ApiSchemas['Ghost'];
  children?: ReactNode;
};

export function GhostApplicationCard({
  ghost,
  children,
}: GhostApplicationCardProps) {
  const requirements = getGhostRequirements(ghost);

  return (
    <Card className='h-full border-border/70 bg-card/75 transition-colors hover:border-primary/45 hover:bg-card'>
      <CardHeader className='flex-row items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-semibold tracking-tight'>{ghost.name}</h3>
          <p className='mt-1 text-xs text-muted-foreground'>
            Заявка на переселение
          </p>
        </div>
        <Badge variant={ghost.anxiety >= 4 ? 'destructive' : 'secondary'}>
          Тревожность {ghost.anxiety}/5
        </Badge>
      </CardHeader>
      <CardContent className='space-y-5 flex flex-col h-full'>
        <dl className='space-y-3 text-sm'>
          <div className='flex items-center justify-between gap-4'>
            <dt className='flex items-center gap-2 text-muted-foreground'>
              <Thermometer className='size-4 text-primary' aria-hidden='true' />{' '}
              Любимая температура
            </dt>
            <dd>{ghost.preferredTemperature} °C</dd>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <dt className='flex items-center gap-2 text-muted-foreground'>
              <CalendarDays
                className='size-4 text-primary'
                aria-hidden='true'
              />{' '}
              Дедлайн
            </dt>
            <dd className='text-right'>
              <time dateTime={ghost.deadline}>
                {formatGhostDeadline(ghost.deadline)}
              </time>
            </dd>
          </div>
        </dl>
        <div>
          <p className='mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground'>
            <Waves className='size-3.5 text-primary' aria-hidden='true' />{' '}
            Особые условия
          </p>
          <ul className='flex flex-wrap gap-1.5' aria-label='Особые условия'>
            {requirements.length ? (
              requirements.map((requirement) => (
                <li key={requirement}>
                  <Badge variant='outline'>{requirement}</Badge>
                </li>
              ))
            ) : (
              <li>
                <Badge variant='secondary'>Без особых условий</Badge>
              </li>
            )}
          </ul>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
