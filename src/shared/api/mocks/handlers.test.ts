import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { handlers } from './index';
import { reset } from './store';

const server = setupServer(...handlers);
const api = (path: string, init?: RequestInit) =>
  fetch(`http://localhost/api${path}`, init);

describe('mock relocation API', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: new URL('http://localhost'),
    });
    server.listen({ onUnhandledRequest: 'error' });
  });
  beforeEach(() => reset('default'));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Отклоняет конфликт без подтверждения', async () => {
    await api('/demo/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fixture: 'manual-conflict' }),
    });
    const ghosts = (await (await api('/ghosts')).json()) as { id: string }[];
    const places = (await (await api('/places')).json()) as {
      id: string;
      name: string;
    }[];
    const placeId = places.find(({ name }) => name === 'Зеркальный маяк')!.id;

    const rejected = await api(`/relocations/${ghosts[0].id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ placeId, force: false }),
    });
    expect(rejected.status).toBe(409);
    expect((await rejected.json()).error.code).toBe('RELOCATION_CONFLICT');

    const forced = await api(`/relocations/${ghosts[0].id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ placeId, force: true }),
    });
    expect(forced.status).toBe(200);
    expect((await forced.json()).mode).toBe('manual');
  });

  it('Сбрасывает прошлые назначения', async () => {
    await api('/relocations/auto-assign', { method: 'POST' });
    await api('/demo/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fixture: 'empty' }),
    });
    const relocations = await (await api('/relocations')).json();

    expect(relocations).toEqual([]);
  });

  it('Показывает проблемную заявку', async () => {
    await api('/demo/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fixture: 'impossible' }),
    });
    await api('/relocations/auto-assign', { method: 'POST' });

    const report = await (await api('/reports/relocation')).json();

    expect(report.assignedCount).toBe(0);
    expect(report.unassignedCount).toBe(1);
    expect(report.problematicGhosts[0].name).toBe('Моргана');
    expect(report.problematicGhosts[0].issues).not.toHaveLength(0);
  });

  it('Объясняет переполненное место', async () => {
    await api('/demo/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fixture: 'full' }),
    });
    await api('/relocations/auto-assign', { method: 'POST' });

    const relocations = (await (await api('/relocations')).json()) as {
      placeId: string | null;
      issues: { code: string }[];
    }[];

    expect(relocations.filter(({ placeId }) => placeId).length).toBe(1);
    expect(relocations[1].issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'CAPACITY_FULL' })]),
    );
  });
});
