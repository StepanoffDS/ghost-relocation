import type { ApiSchemas } from '../schema'

type Ghost = ApiSchemas['Ghost']
type Place = ApiSchemas['Place']
type Relocation = ApiSchemas['Relocation']

export type DemoFixture = ApiSchemas['DemoFixture']
export type MockState = { ghosts: Ghost[]; places: Place[]; relocations: Relocation[] }

const ids = {
  agatha: '00000000-0000-4000-8000-000000000001',
  boris: '00000000-0000-4000-8000-000000000002',
  clara: '00000000-0000-4000-8000-000000000003',
  dante: '00000000-0000-4000-8000-000000000004',
  castle: '10000000-0000-4000-8000-000000000001',
  lighthouse: '10000000-0000-4000-8000-000000000002',
  library: '10000000-0000-4000-8000-000000000003',
  theater: '10000000-0000-4000-8000-000000000004',
  basement: '10000000-0000-4000-8000-000000000005',
} as const

const emptyRelocations = (ghosts: Ghost[]): Relocation[] =>
  ghosts.map(({ id: ghostId }) => ({ ghostId, placeId: null, mode: 'unassigned', score: null, issues: [] }))

const defaultPlaces: Place[] = [
  { id: ids.castle, name: 'Замок Вороньих Скал', type: 'castle', capacity: 2, temperature: 8, lighting: 'low', noise: 'low', humidity: 'high', hasHumans: false, hasAttic: true, hasMirrors: false, restrictions: [] },
  { id: ids.lighthouse, name: 'Старый маяк', type: 'lighthouse', capacity: 1, temperature: 12, lighting: 'high', noise: 'medium', humidity: 'high', hasHumans: false, hasAttic: true, hasMirrors: true, restrictions: ['тишина'] },
  { id: ids.library, name: 'Ночная библиотека', type: 'library', capacity: 2, temperature: 18, lighting: 'medium', noise: 'low', humidity: 'medium', hasHumans: true, hasAttic: false, hasMirrors: false, restrictions: [] },
  { id: ids.theater, name: 'Заброшенный театр', type: 'theater', capacity: 1, temperature: 15, lighting: 'low', noise: 'high', humidity: 'medium', hasHumans: false, hasAttic: false, hasMirrors: true, restrictions: [] },
  { id: ids.basement, name: 'Подвал типографии', type: 'basement', capacity: 1, temperature: 10, lighting: 'low', noise: 'medium', humidity: 'high', hasHumans: false, hasAttic: false, hasMirrors: false, restrictions: [] },
]

const defaultGhosts: Ghost[] = [
  { id: ids.agatha, name: 'Агата', anxiety: 5, preferredTemperature: 8, deadline: '2026-12-20', requirements: { needsAttic: true, avoidsMirrors: true, noHumans: true, lovesHumidity: true }, note: null },
  { id: ids.boris, name: 'Борис', anxiety: 2, preferredTemperature: 17, deadline: '2026-11-15', requirements: { needsAttic: false, avoidsMirrors: false, noHumans: false, lovesHumidity: false }, note: null },
  { id: ids.clara, name: 'Клара', anxiety: 4, preferredTemperature: 11, deadline: '2026-10-10', requirements: { needsAttic: false, avoidsMirrors: true, noHumans: true, lovesHumidity: true }, note: null },
  { id: ids.dante, name: 'Данте', anxiety: 3, preferredTemperature: 6, deadline: '2026-01-01', requirements: { needsAttic: false, avoidsMirrors: false, noHumans: false, lovesHumidity: false }, note: 'тишина' },
]

const defaultState: MockState = { ghosts: defaultGhosts, places: defaultPlaces, relocations: emptyRelocations(defaultGhosts) }

const impossibleGhost: Ghost = {
  id: ids.agatha, name: 'Моргана', anxiety: 5, preferredTemperature: 4, deadline: '2026-12-20',
  requirements: { needsAttic: true, avoidsMirrors: true, noHumans: true, lovesHumidity: true }, note: null,
}

const impossibleState: MockState = {
  ghosts: [impossibleGhost],
  places: [{ id: ids.lighthouse, name: 'Светлый маяк', type: 'lighthouse', capacity: 1, temperature: 20, lighting: 'high', noise: 'high', humidity: 'low', hasHumans: true, hasAttic: false, hasMirrors: true, restrictions: [] }],
  relocations: emptyRelocations([impossibleGhost]),
}

const fullOwner: Ghost = { ...defaultGhosts[0], id: ids.agatha, name: 'Занявшая место Агата' }
const fullGuest: Ghost = { ...defaultGhosts[2], id: ids.boris, name: 'Ждёт освобождения Борис' }
const fullState: MockState = {
  ghosts: [fullOwner, fullGuest],
  places: [{ id: ids.basement, name: 'Единственный сухой подвал', type: 'basement', capacity: 1, temperature: 10, lighting: 'low', noise: 'low', humidity: 'high', hasHumans: false, hasAttic: true, hasMirrors: false, restrictions: [] }],
  relocations: [
    { ghostId: fullOwner.id, placeId: ids.basement, mode: 'manual', score: 100, issues: [] },
    { ghostId: fullGuest.id, placeId: null, mode: 'unassigned', score: null, issues: [] },
  ],
}

const conflictGhost: Ghost = { ...defaultGhosts[0], id: ids.agatha, name: 'Эдгар' }
const manualConflictState: MockState = {
  ghosts: [conflictGhost],
  places: [
    { id: ids.castle, name: 'Тихий замок', type: 'castle', capacity: 1, temperature: 8, lighting: 'low', noise: 'low', humidity: 'high', hasHumans: false, hasAttic: true, hasMirrors: false, restrictions: [] },
    { id: ids.lighthouse, name: 'Зеркальный маяк', type: 'lighthouse', capacity: 1, temperature: 8, lighting: 'high', noise: 'high', humidity: 'low', hasHumans: true, hasAttic: false, hasMirrors: true, restrictions: [] },
  ],
  relocations: emptyRelocations([conflictGhost]),
}

const fixtures: Record<DemoFixture, MockState> = {
  default: defaultState,
  empty: { ghosts: [], places: defaultPlaces, relocations: [] },
  impossible: impossibleState,
  full: fullState,
  'manual-conflict': manualConflictState,
}

export const createFixture = (fixture: DemoFixture): MockState => structuredClone(fixtures[fixture])
