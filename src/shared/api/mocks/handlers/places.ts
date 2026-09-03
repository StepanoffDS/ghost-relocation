import { getState } from '../store'
import { getOccupancy } from '../domain/relocation-rules'
import { http } from '../http'

export const placeHandlers = [
  http.get('/places', ({ response }) => {
    const { places, relocations } = getState()
    return response(200).json(places.map((place) => {
      const occupied = getOccupancy(relocations, place.id)
      return { ...place, occupied, isOverloaded: occupied > place.capacity }
    }))
  }),
]
