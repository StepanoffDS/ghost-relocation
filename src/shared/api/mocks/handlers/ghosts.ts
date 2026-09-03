import { getState } from '../store'
import { http } from '../http'

export const ghostHandlers = [
  http.get('/ghosts', ({ response }) => response(200).json(getState().ghosts)),
]
