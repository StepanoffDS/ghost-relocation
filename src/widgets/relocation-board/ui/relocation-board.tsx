import { GhostApplicationCard, useGhosts } from '@/entities/ghost';
import { usePlaces } from '@/entities/place';
import { RelocationDecision, useRelocations } from '@/entities/relocation';
import { ManualRelocationDialog } from '@/features/manual-relocation';

import { EmptyBoard, ErrorBoard, PendingBoard } from './board-states';

export function RelocationBoard() {
  const ghosts = useGhosts();
  const places = usePlaces();
  const relocations = useRelocations();

  if (ghosts.isPending || places.isPending || relocations.isPending)
    return <PendingBoard />;

  if (ghosts.isError || places.isError || relocations.isError)
    return <ErrorBoard onRetry={() => void ghosts.refetch()} />;

  if (!ghosts.data?.length) return <EmptyBoard />;

  const placeNames = new Map(places.data?.map(({ id, name }) => [id, name]));
  const decisions = new Map(
    relocations.data?.map((relocation) => [relocation.ghostId, relocation]),
  );

  return (
    <ul
      className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'
      aria-label='Список заявок от привидений'
    >
      {ghosts.data.map((ghost) => {
        const relocation = decisions.get(ghost.id);
        return (
          <li key={ghost.id}>
            <GhostApplicationCard ghost={ghost}>
              {relocation && (
                <>
                  <RelocationDecision
                    relocation={relocation}
                    className='mt-auto'
                    placeName={
                      relocation.placeId
                        ? placeNames.get(relocation.placeId)
                        : undefined
                    }
                  />
                  <ManualRelocationDialog
                    ghost={ghost}
                    places={places.data}
                    relocation={relocation}
                  />
                </>
              )}
            </GhostApplicationCard>
          </li>
        );
      })}
    </ul>
  );
}
