import type { PlacesListState, PlacesListStateInput } from '../types';

export const getPlacesListState = ({
  isPending,
  isError,
  data,
}: PlacesListStateInput): PlacesListState => {
  if (isPending) return 'pending';
  if (isError) return 'error';
  if (!data?.length) return 'empty';
  return 'ready';
};
