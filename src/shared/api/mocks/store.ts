import type { ApiSchemas } from '../schema';
import { createFixture, type DemoFixture, type MockState } from './seed';

type Relocation = ApiSchemas['Relocation'];

let state = createFixture('default');

export const getState = (): Readonly<MockState> => state;
export const replaceState = (nextState: MockState): void => {
  state = structuredClone(nextState);
};
export const reset = (fixture: DemoFixture): void => {
  state = createFixture(fixture);
};

export const assign = (relocation: Relocation): void => {
  state = {
    ...state,
    relocations: state.relocations.map((item) =>
      item.ghostId === relocation.ghostId ? relocation : item,
    ),
  };
};

export const unassign = (
  ghostId: string,
  issues: Relocation['issues'] = [],
): void => {
  assign({ ghostId, placeId: null, mode: 'unassigned', score: null, issues });
};
