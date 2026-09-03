import { getOccupancy } from '../domain/relocation-rules';
import { http } from '../http';
import { getState } from '../store';

export const placeHandlers = [
  http.get('/places', ({ response }) => {
    const { places, relocations } = getState();
    return response(200).json(
      places.map((place) => {
        const occupied = getOccupancy(relocations, place.id);
        return { ...place, occupied, isOverloaded: occupied > place.capacity };
      }),
    );
  }),
];
