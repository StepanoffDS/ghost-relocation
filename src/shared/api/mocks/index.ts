import { demoHandlers } from './handlers/demo'
import { ghostHandlers } from './handlers/ghosts'
import { placeHandlers } from './handlers/places'
import { relocationHandlers } from './handlers/relocations'
import { reportHandlers } from './handlers/reports'

export const handlers = [...ghostHandlers, ...placeHandlers, ...relocationHandlers, ...reportHandlers, ...demoHandlers]
