import { getOccupancy } from '../domain/relocation-rules';
import { http } from '../http';
import { getState } from '../store';

export const reportHandlers = [
  http.get('/reports/relocation', ({ response }) => {
    const { ghosts, relocations, places } = getState();
    const problematicGhosts = relocations
      .filter(({ issues }) => issues.some(({ severity }) => severity === 'blocker'))
      .map(({ ghostId, issues }) => ({
        ghostId,
        name: ghosts.find(({ id }) => id === ghostId)?.name ?? 'Неизвестная заявка',
        issues,
      }))
      .sort((left, right) => right.issues.length - left.issues.length);
    const overloadedPlaces = places
      .map((place) => {
        const occupied = getOccupancy(relocations, place.id);
        return { ...place, occupied, isOverloaded: occupied > place.capacity };
      })
      .filter(({ occupied, capacity }) => occupied >= capacity);
    return response(200).json({
      assignedCount: relocations.filter(({ placeId }) => placeId !== null)
        .length,
      unassignedCount: relocations.filter(({ placeId }) => placeId === null)
        .length,
      problematicGhosts,
      overloadedPlaces,
      manualWarnings: relocations.filter(
        ({ mode, issues }) => mode === 'manual' && issues.length > 0,
      ),
    });
  }),
];
