import type { useGhosts } from '@/entities/ghost';

export type GhostsQuery = ReturnType<typeof useGhosts>;
export type BoardViewProps = { ghosts: GhostsQuery };
export type BoardState = 'pending' | 'error' | 'empty' | 'ready';
export type BoardStateInput = Pick<
  GhostsQuery,
  'isPending' | 'isError' | 'data'
>;
