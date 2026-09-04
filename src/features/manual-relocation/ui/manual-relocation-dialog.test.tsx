import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { handlers } from '@/shared/api/mocks';
import { http } from '@/shared/api/mocks/http';
import { createFixture } from '@/shared/api/mocks/seed';
import { reset } from '@/shared/api/mocks/store';

import { ManualRelocationDialog } from './manual-relocation-dialog';

const server = setupServer(...handlers);

describe('ManualRelocationDialog', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  beforeEach(() => reset('manual-conflict'));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Требует подтверждения конфликта', async () => {
    const { ghosts, places, relocations } = createFixture('manual-conflict');
    const conflictPlace = places.find(({ name }) => name === 'Зеркальный маяк')!;
    const calls: boolean[] = [];

    server.use(
      http.put('/relocations/{ghostId}', async ({ request, response }) => {
        const { force } = (await request.json()) as { force: boolean };
        calls.push(force);
        return force
          ? response(200).json({
              ...relocations[0],
              placeId: conflictPlace.id,
              mode: 'manual',
            })
          : response(409).json({
              error: {
                code: 'RELOCATION_CONFLICT',
                message: 'Выбранное место нарушает условия заявки',
                details: {
                  issues: [
                    {
                      code: 'MIRRORS_FORBIDDEN',
                      message: 'Привидение боится зеркал',
                      severity: 'blocker',
                    },
                  ],
                },
              },
            });
      }),
    );
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ManualRelocationDialog
          ghost={ghosts[0]}
          places={places.map((place) => ({
            ...place,
            occupied: 0,
            isOverloaded: false,
          }))}
          relocation={{ ...relocations[0], placeId: conflictPlace.id }}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Изменить место' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByText('Привидение боится зеркал')).toBeTruthy();
    expect(calls).toEqual([false]);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Подтвердить несмотря на предупреждения',
      }),
    );

    await waitFor(() => expect(calls).toEqual([false, true]));
  });
});
