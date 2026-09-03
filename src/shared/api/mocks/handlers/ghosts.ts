import { http } from '../http';
import { getState } from '../store';

export const ghostHandlers = [
  http.get('/ghosts', ({ response }) => response(200).json(getState().ghosts)),
];
