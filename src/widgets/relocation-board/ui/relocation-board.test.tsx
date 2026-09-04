import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { handlers } from '@/shared/api/mocks';
import { reset } from '@/shared/api/mocks/store';

import { RelocationBoard } from './relocation-board';

const server = setupServer(...handlers);
const renderBoard = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <RelocationBoard />
    </QueryClientProvider>,
  );

describe('RelocationBoard', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  beforeEach(() => reset('default'));
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('Показывает причины отказа', async () => {
    reset('impossible');
    await fetch('http://localhost/api/relocations/auto-assign', {
      method: 'POST',
    });

    renderBoard();

    expect(await screen.findByText('Моргана')).toBeTruthy();
    expect(screen.getByText('Для заявки нужен чердак')).toBeTruthy();
    expect(screen.getByText('Для заявки здесь слишком светло')).toBeTruthy();
    expect(screen.getByText('Привидение боится зеркал')).toBeTruthy();
  });

  it('Показывает ошибку API', async () => {
    server.use(
      http.get('http://localhost/api/ghosts', () =>
        HttpResponse.json(
          {
            error: { code: 'INTERNAL_ERROR', message: 'Mock API unavailable' },
          },
          { status: 500 },
        ),
      ),
    );

    renderBoard();

    expect(await screen.findByText('Не удалось загрузить заявки')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeTruthy();
  });
});
