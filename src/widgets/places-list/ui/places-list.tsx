import { usePlaces } from '@/entities/place';

import { getPlacesListState } from '../model/places-list-state';
import {
  EmptyPlacesList,
  ErrorPlacesList,
  FallbackPlacesList,
  PendingPlacesList,
  ReadyPlacesList,
} from './places-list-states';

export function PlacesList() {
  const places = usePlaces();

  switch (getPlacesListState(places)) {
    case 'pending':
      return <PendingPlacesList />;
    case 'error':
      return <ErrorPlacesList places={places} />;
    case 'empty':
      return <EmptyPlacesList />;
    case 'ready':
      return <ReadyPlacesList places={places} />;
    default:
      return <FallbackPlacesList />;
  }
}
