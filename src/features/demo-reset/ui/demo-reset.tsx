import { useState } from 'react';

import type { ApiSchemas } from '@/shared/api/schema';
import { Alert, AlertDescription } from '@/shared/ui/kit/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';

import { useDemoReset } from '../api/use-demo-reset';

const fixtures: { value: ApiSchemas['DemoFixture']; label: string }[] = [
  { value: 'default', label: 'Основной сценарий' },
  { value: 'empty', label: 'Нет заявок' },
  { value: 'impossible', label: 'Нет подходящего места' },
  { value: 'full', label: 'Место заполнено' },
  { value: 'manual-conflict', label: 'Ручной конфликт' },
];

export function DemoReset() {
  const [fixture, setFixture] = useState<ApiSchemas['DemoFixture']>('default');
  const reset = useDemoReset();
  const selectId = 'demo-fixture';

  return (
    <div className='grid gap-2'>
      <label
        className='block text-xs font-medium text-muted-foreground'
        htmlFor={selectId}
      >
        Демо-набор
      </label>
      <Select
        value={fixture}
        items={fixtures}
        disabled={reset.isPending}
        onValueChange={(value) => {
          if (!value || value === fixture) return;
          reset.mutate(value, { onSuccess: () => setFixture(value) });
        }}
      >
        <SelectTrigger id={selectId} aria-label='Демо-набор'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fixtures.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {reset.isError && (
        <Alert variant='destructive'>
          <AlertDescription>{reset.error.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
