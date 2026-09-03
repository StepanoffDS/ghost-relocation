import type { BoardState, BoardStateInput } from '../types';

export const getRelocationBoardState = ({
  isPending,
  isError,
  data,
}: BoardStateInput): BoardState => {
  if (isPending) return 'pending';
  if (isError) return 'error';
  if (!data?.length) return 'empty';
  return 'ready';
};
