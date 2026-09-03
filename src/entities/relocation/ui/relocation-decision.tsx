import type { ApiSchemas } from '@/shared/api/schema';
import { cn } from '@/shared/lib/css';
import { Badge } from '@/shared/ui/kit/badge';

type RelocationDecisionProps = {
  relocation: ApiSchemas['Relocation'];
  placeName?: string;
  className?: string;
};

export function RelocationDecision({
  relocation,
  placeName,
  className,
}: RelocationDecisionProps) {
  return (
    <section
      className={cn('space-y-2 border-t border-border/70 pt-4', className)}
    >
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h4 className='text-sm font-medium'>Решение подбора</h4>
        {relocation.score !== null && (
          <Badge>Совместимость {relocation.score}/100</Badge>
        )}
      </div>
      {relocation.placeId ? (
        <p className='text-sm'>Предложено: {placeName ?? 'место'}</p>
      ) : relocation.issues.length ? (
        <p className='text-sm text-destructive'>Подходящего места нет</p>
      ) : (
        <p className='text-sm text-muted-foreground'>
          Подбор ещё не запускался
        </p>
      )}
      {relocation.issues.length > 0 && (
        <ul className='space-y-1 text-xs text-muted-foreground'>
          {relocation.issues.map((issue) => (
            <li key={issue.code}>{issue.message}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
