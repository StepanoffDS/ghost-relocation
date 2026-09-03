import type { ApiSchemas } from '../../schema'

type Ghost = ApiSchemas['Ghost']
type Place = ApiSchemas['Place']
type Relocation = ApiSchemas['Relocation']
type RelocationIssue = ApiSchemas['RelocationIssue']

export type PlaceEvaluation = { issues: RelocationIssue[]; score: number | null }

const issue = (code: string, message: string, severity: RelocationIssue['severity']): RelocationIssue => ({ code, message, severity })
const today = (): string => new Date().toISOString().slice(0, 10)

export const evaluatePlace = (ghost: Ghost, place: Place, occupied: number, currentDate = today()): PlaceEvaluation => {
  const { requirements } = ghost
  const blockers: RelocationIssue[] = []

  if (ghost.deadline < currentDate) blockers.push(issue('DEADLINE_EXPIRED', 'Дедлайн переселения уже прошёл', 'blocker'))
  if (occupied >= place.capacity) blockers.push(issue('CAPACITY_FULL', 'В месте нет свободной вместимости', 'blocker'))
  if (requirements.needsAttic && !place.hasAttic) blockers.push(issue('ATTIC_REQUIRED', 'Для заявки нужен чердак', 'blocker'))
  if (requirements.avoidsMirrors && place.hasMirrors) blockers.push(issue('MIRRORS_FORBIDDEN', 'Привидение боится зеркал', 'blocker'))
  if (requirements.noHumans && place.hasHumans) blockers.push(issue('HUMANS_FORBIDDEN', 'Нельзя селить рядом с людьми', 'blocker'))
  if (requirements.lovesHumidity && place.humidity !== 'high') blockers.push(issue('HUMIDITY_REQUIRED', 'Привидению нужна высокая влажность', 'blocker'))
  if (ghost.note && place.restrictions.some((restriction) => ghost.note?.toLocaleLowerCase().includes(restriction.toLocaleLowerCase()))) {
    blockers.push(issue('PLACE_RESTRICTION', 'Ограничение места конфликтует с условием заявки', 'blocker'))
  }
  if (blockers.length) return { issues: blockers, score: null }

  const temperature = Math.max(0, 40 - 4 * Math.abs(place.temperature - ghost.preferredTemperature))
  const sensitive = ghost.anxiety >= 4
  const lighting = sensitive ? ({ low: 20, medium: 12, high: 4 }[place.lighting]) : 12
  const noise = sensitive ? ({ low: 20, medium: 12, high: 4 }[place.noise]) : 12
  const humidity = requirements.lovesHumidity ? 10 : 5
  const capacity = occupied + 1 < place.capacity ? 10 : 4
  const score = Math.max(0, Math.min(100, temperature + lighting + noise + humidity + capacity))

  return { issues: [issue('SCORE_EXPLANATION', `Совместимость ${score}/100: температура, свет, шум, влажность и вместимость`, 'warning')], score }
}

const occupancyFor = (relocations: Relocation[], placeId: string): number => relocations.filter((item) => item.placeId === placeId).length

const blockersForAllPlaces = (ghost: Ghost, places: Place[], relocations: Relocation[], currentDate?: string): RelocationIssue[] => {
  const issues = places.flatMap((place) => evaluatePlace(ghost, place, occupancyFor(relocations, place.id), currentDate).issues.filter(({ severity }) => severity === 'blocker'))
  return issues.length ? [...new Map(issues.map((item) => [item.code, item])).values()] : [issue('NO_PLACES_AVAILABLE', 'Нет доступных мест для переселения', 'blocker')]
}

export const autoAssign = (ghosts: Ghost[], places: Place[], relocations: Relocation[], currentDate?: string): Relocation[] => {
  const preserved = relocations.filter(({ mode }) => mode === 'manual')
  const candidates = ghosts.filter((ghost) => !preserved.some(({ ghostId }) => ghostId === ghost.id))
  const sorted = [...candidates].sort((left, right) => {
    const allowed = (ghost: Ghost) => places.filter((place) => evaluatePlace(ghost, place, occupancyFor(preserved, place.id), currentDate).score !== null).length
    return allowed(left) - allowed(right) || left.deadline.localeCompare(right.deadline) || right.anxiety - left.anxiety
  })
  const next = [...preserved]

  for (const ghost of sorted) {
    const options = places.map((place) => ({ place, evaluation: evaluatePlace(ghost, place, occupancyFor(next, place.id), currentDate) }))
      .filter(({ evaluation }) => evaluation.score !== null)
      .sort((left, right) => right.evaluation.score! - left.evaluation.score! ||
        (right.place.capacity - occupancyFor(next, right.place.id)) - (left.place.capacity - occupancyFor(next, left.place.id)) ||
        left.place.id.localeCompare(right.place.id))
    const best = options[0]
    if (best) next.push({ ghostId: ghost.id, placeId: best.place.id, mode: 'auto', score: best.evaluation.score, issues: best.evaluation.issues })
    else next.push({ ghostId: ghost.id, placeId: null, mode: 'unassigned', score: null, issues: blockersForAllPlaces(ghost, places, next, currentDate) })
  }

  return ghosts.map((ghost) => next.find(({ ghostId }) => ghostId === ghost.id)!)
}

export const getOccupancy = (relocations: Relocation[], placeId: string): number => occupancyFor(relocations, placeId)
