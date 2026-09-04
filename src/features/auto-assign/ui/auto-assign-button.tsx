import { Sparkles } from 'lucide-react';

import { Alert, AlertDescription } from '@/shared/ui/kit/alert';
import { Button } from '@/shared/ui/kit/button';

import { useAutoAssign } from '../api/use-auto-assign';

export function AutoAssignButton() {
  const autoAssign = useAutoAssign();

  return (
    <div className='space-y-2'>
      <Button
        size='lg'
        disabled={autoAssign.isPending}
        onClick={() => autoAssign.mutate()}
      >
        <Sparkles data-icon='inline-start' />
        {autoAssign.isPending
          ? 'Подбираем места…'
          : 'Распределить автоматически'}
      </Button>
      {autoAssign.isError && (
        <Alert variant='destructive'>
          <AlertDescription>{autoAssign.error.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
