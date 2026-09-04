import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { useGhosts } from '@/entities/ghost';
import { handlers } from '@/shared/api/mocks';
import { reset } from '@/shared/api/mocks/store';
import { queryClient } from '@/shared/api/query-client';

import { useDemoReset } from '../api/use-demo-reset';
import { DemoReset } from './demo-reset';

const server = setupServer(...handlers);

function DemoState() {
  const ghosts = useGhosts();
  return <p>{ghosts.data ? `Заявок: ${ghosts.data.length}` : 'Загрузка'}</p>;
}

function ResetToEmpty() {
  const reset = useDemoReset();
  return <button onClick={() => reset.mutate('empty')}>Сбросить набор</button>;
}

describe('DemoReset', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  beforeEach(() => {
    reset('default');
    queryClient.clear();
  });
  afterEach(() => {
    queryClient.clear();
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('Обновляет заявки после смены набора', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DemoReset />
        <DemoState />
        <ResetToEmpty />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Заявок: 4')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Сбросить набор' }));

    expect(await screen.findByText('Заявок: 0')).toBeTruthy();
  });
});
