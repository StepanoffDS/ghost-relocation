import { getOccupancy } from '../domain/relocation-rules';
import { http } from '../http';
import { getState } from '../store';

export const reportHandlers = [
  http.get('/reports/relocation', ({ response }) => {
    const { relocations, places } = getState();
    const problematicGhosts = relocations
      .filter(({ mode, issues }) => mode === 'unassigned' || issues.length > 0)
      .map(({ ghostId, issues }) => ({ ghostId, issues }));
    const overloadedPlaces = places
      .map((place) => {
        const occupied = getOccupancy(relocations, place.id);
        return { ...place, occupied, isOverloaded: occupied > place.capacity };
      })
      .filter(({ isOverloaded }) => isOverloaded);
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
