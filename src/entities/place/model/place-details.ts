import type { ApiSchemas } from '@/shared/api/schema';

export type PlaceStatus = 'available' | 'full' | 'overloaded';

const placeTypes = {
  castle: 'Замок',
  lighthouse: 'Маяк',
  library: 'Библиотека',
  theater: 'Театр',
  basement: 'Подвал',
} as const;

const levels = { low: 'низкий', medium: 'средний', high: 'высокий' } as const;

export const getPlaceStatus = (
  place: Pick<
    ApiSchemas['PlaceWithOccupancy'],
    'occupied' | 'capacity' | 'isOverloaded'
  >,
): PlaceStatus => {
  if (place.isOverloaded) return 'overloaded';
  return place.occupied === place.capacity ? 'full' : 'available';
};

export const getPlaceType = (type: ApiSchemas['Place']['type']): string =>
  placeTypes[type];

export const getPlaceDetails = (place: ApiSchemas['PlaceWithOccupancy']) =>
  [
    ['Температура', `${place.temperature} °C`],
    ['Освещение', levels[place.lighting]],
    ['Шум', levels[place.noise]],
    ['Влажность', levels[place.humidity]],
  ] as const;

export const getPlaceFeatures = (place: ApiSchemas['PlaceWithOccupancy']) => [
  place.hasAttic ? 'Есть чердак' : 'Без чердака',
  place.hasMirrors ? 'Есть зеркала' : 'Без зеркал',
  place.hasHumans ? 'Есть люди' : 'Без людей',
];
