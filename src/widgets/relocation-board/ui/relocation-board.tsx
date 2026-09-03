import { useGhosts } from '@/entities/ghost';

import { getRelocationBoardState } from '../model/relocation-board-state';
import {
  EmptyBoard,
  ErrorBoard,
  FallbackBoard,
  PendingBoard,
  ReadyBoard,
} from './board-states';

export function RelocationBoard() {
  const ghosts = useGhosts();

  switch (getRelocationBoardState(ghosts)) {
    case 'pending':
      return <PendingBoard />;
    case 'error':
      return <ErrorBoard ghosts={ghosts} />;
    case 'empty':
      return <EmptyBoard />;
    case 'ready':
      return <ReadyBoard ghosts={ghosts} />;
    default:
      return <FallbackBoard />;
  }
}
