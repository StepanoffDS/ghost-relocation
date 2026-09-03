import type { usePlaces } from '@/entities/place';

export type PlacesQuery = ReturnType<typeof usePlaces>;
export type PlacesViewProps = { places: PlacesQuery };
export type PlacesListState = 'pending' | 'error' | 'empty' | 'ready';
export type PlacesListStateInput = Pick<
  PlacesQuery,
  'isPending' | 'isError' | 'data'
>;
