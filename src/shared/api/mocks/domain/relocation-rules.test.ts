import { describe, expect, it } from 'vitest';

import { createFixture } from '../seed';
import { autoAssign } from './relocation-rules';

describe('relocation rules', () => {
  it('assigns deterministically without exceeding capacity', () => {
    const state = createFixture('default');
    const first = autoAssign(
      state.ghosts,
      state.places,
      state.relocations,
      '2026-09-03',
    );
    const second = autoAssign(
      state.ghosts,
      state.places,
      state.relocations,
      '2026-09-03',
    );

    expect(first).toEqual(second);
    expect(
      state.places.every(
        (place) =>
          first.filter(({ placeId }) => placeId === place.id).length <=
          place.capacity,
      ),
    ).toBe(true);
  });

  it('returns every blocker for an impossible application', () => {
    const state = createFixture('impossible');
    const [relocation] = autoAssign(
      state.ghosts,
      state.places,
      state.relocations,
      '2026-09-03',
    );

    expect(relocation).toMatchObject({ mode: 'unassigned', placeId: null });
    expect(relocation.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        'ATTIC_REQUIRED',
        'BRIGHT_LIGHT_FORBIDDEN',
        'MIRRORS_FORBIDDEN',
        'HUMANS_FORBIDDEN',
        'HUMIDITY_REQUIRED',
      ]),
    );
  });

  it('returns a concise explanation for the selected place', () => {
    const state = createFixture('default');
    const [relocation] = autoAssign(
      state.ghosts,
      state.places,
      state.relocations,
      '2026-09-03',
    );

    expect(relocation).toMatchObject({ mode: 'auto', score: 100 });
    expect(relocation.issues).toContainEqual({
      code: 'SCORE_EXPLANATION',
      message:
        'Совместимость 100/100: температура, свет, шум, влажность и вместимость',
      severity: 'warning',
    });
  });
});
