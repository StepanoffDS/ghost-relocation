type WorklogStage = {
  name: string
  durationMinutes: number | null
  developerWork: string[]
  aiWork: string[]
  keyPrompts: string[]
  outcome: string
}

export type AiWorklog = {
  generatedAt: string
  tools: { name: string; purpose: string; tokenCount: number | null }[]
  totalDurationMinutes: number | null
  tokenSummary: string
  stages: WorklogStage[]
  decisions: string[]
  aiCorrections: { issue: string; correction: string }[]
  futureImprovements: string[]
}

export const worklog: AiWorklog = {
  generatedAt: '2026-09-03',
  tools: [
    { name: 'Codex', purpose: 'Реализация mock API и проверок', tokenCount: null },
    { name: 'Context7', purpose: 'Проверка API MSW и OpenAPI-инструментов', tokenCount: null },
  ],
  totalDurationMinutes: null,
  tokenSummary: 'Инструмент не предоставляет статистику токенов; токены не считались',
  stages: [{
    name: 'Mock API и алгоритм',
    durationMinutes: null,
    developerWork: ['Утвердил контракт, fixtures и детерминированные правила совместимости.'],
    aiWork: ['Создал OpenAPI-схему, MSW handlers, in-memory store и тесты.'],
    keyPrompts: ['Реализовать mock backend по контракту из docs/backend.md.'],
    outcome: 'Mock API готов; фактическое время будет заполнено при финальной проверке приложения.',
  }],
  decisions: ['Не добавлять сервер, БД и авторизацию: они вне требований mock API.'],
  aiCorrections: [{ issue: 'Node-тест не сопоставлял относительные MSW routes без origin.', correction: 'В тесте задан localhost origin; browser-конфигурация остаётся с baseUrl /api.' }],
  futureImprovements: ['Добавить экран AI Worklog после реализации интерфейса.'],
}
