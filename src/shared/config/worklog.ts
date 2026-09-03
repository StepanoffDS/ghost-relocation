type WorklogStage = {
  name: string;
  durationMinutes: number | null;
  developerWork: string[];
  aiWork: string[];
  keyPrompts: string[];
  outcome: string;
};

export type AiWorklog = {
  generatedAt: string;
  tools: { name: string; purpose: string; tokenCount: number | null }[];
  totalDurationMinutes: number | null;
  tokenSummary: string;
  stages: WorklogStage[];
  decisions: string[];
  aiCorrections: { issue: string; correction: string }[];
  futureImprovements: string[];
};

export const worklog: AiWorklog = {
  generatedAt: '2026-09-03',
  tools: [
    {
      name: 'Codex',
      purpose: 'Реализация mock API и проверок',
      tokenCount: null,
    },
    {
      name: 'Context7',
      purpose: 'Проверка API MSW и OpenAPI-инструментов',
      tokenCount: null,
    },
  ],
  totalDurationMinutes: null,
  tokenSummary:
    'Инструмент не предоставляет статистику токенов; токены не считались',
  stages: [
    {
      name: 'Mock API и алгоритм',
      durationMinutes: null,
      developerWork: [
        'Утвердил контракт, fixtures и детерминированные правила совместимости.',
      ],
      aiWork: ['Создал OpenAPI-схему, MSW handlers, in-memory store и тесты.'],
      keyPrompts: ['Реализовать mock backend по контракту из docs/backend.md.'],
      outcome:
        'Mock API готов; фактическое время будет заполнено при финальной проверке приложения.',
    },
    {
      name: 'Список заявок',
      durationMinutes: null,
      developerWork: ['Время этапа отдельно не фиксировалось.'],
      aiWork: [
        'Добавил типизированный запрос заявок, состояния загрузки, ошибки и пустого списка, а также адаптивные карточки.',
      ],
      keyPrompts: [
        'Реализовать список заявок с именем, тревожностью, температурой, дедлайном и особыми условиями.',
      ],
      outcome:
        'Список получает данные из mock API; метрики времени и токенов намеренно не выдуманы.',
    },
    {
      name: 'Отображение автоматического подбора',
      durationMinutes: null,
      developerWork: [
        'Выбрал не дублировать формулу на клиенте: источником решения остаётся mock API.',
      ],
      aiWork: [
        'Добавил типизированный запрос решений, запуск автораспределения и отображение места, балла и причин в карточке заявки.',
      ],
      keyPrompts: [
        'Показать для каждой заявки подходящее место и кратко объяснить расчёт.',
      ],
      outcome:
        'После запуска оператор видит предложенное место, совместимость 0–100 и объяснение; неподходящая заявка показывает все блокеры.',
    },
    {
      name: 'Список мест переселения',
      durationMinutes: null,
      developerWork: [
        'Выбрал повторить паттерн списка заявок без нового API-контракта и зависимостей.',
      ],
      aiWork: [
        'Добавил hook GET /places, карточки мест и состояния загрузки, ошибки и пустого списка.',
      ],
      keyPrompts: [
        'Реализовать список мест переселения по task.md, используя паттерны списка заявок.',
      ],
      outcome:
        'Экран показывает характеристики, ограничения и вычисляемую API занятость. Проверены yarn lint, yarn test, yarn build и ширины 1440/375 px; время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Роутинг',
      durationMinutes: null,
      developerWork: ['Время этапа отдельно не фиксировалось.'],
      aiWork: [
        'Добавил конфигурацию React Router, layout с навигацией и fallback-страницу.',
      ],
      keyPrompts: [
        'Реализовать роутинг React Router, вдохновляясь router.tsx из booking-rooms.',
      ],
      outcome:
        'Маршруты /, /places, /report, /ai-worklog и fallback определены в app/router.tsx.',
    },
    {
      name: 'Визуальный стиль',
      durationMinutes: null,
      developerWork: ['Время этапа отдельно не фиксировалось.'],
      aiWork: [
        'Перевёл интерфейс на Tailwind и локальные shadcn-компоненты, добавив states для списка.',
      ],
      keyPrompts: ['Возобновить дизайн с установленными Tailwind и shadcn.'],
      outcome:
        'Ручные стили заменены Tailwind-классами; компоненты добавлены через shadcn CLI.',
    },
    {
      name: 'Рефакторинг состояний списка',
      durationMinutes: null,
      developerWork: [
        'Запросил заменить цепочку if для состояний списка на диспетчеризацию по состоянию.',
      ],
      aiWork: [
        'Разделил представления pending, error, empty и ready; выбор представления выполняется через switch.',
      ],
      keyPrompts: [
        'Применить паттерн RoomsScreen для состояний RelocationBoard.',
      ],
      outcome:
        'Поведение списка сохранено; для неожиданного состояния есть защитная заглушка. yarn lint и yarn build проходят.',
    },
    {
      name: 'Качество кода: порядок импортов',
      durationMinutes: null,
      developerWork: ['Запросил единый порядок импортов.'],
      aiWork: [
        'Подключил ESLint-правило с автоматическим исправлением порядка импортов.',
      ],
      keyPrompts: ['Добавить ESLint-правило по сортировке импортов.'],
      outcome:
        'eslint-plugin-simple-import-sort добавлен в devDependencies; проверка выполняется через yarn lint.',
    },
    {
      name: 'Рефакторинг карточки заявки',
      durationMinutes: null,
      developerWork: ['Запросил вынести вычисления карточки заявки в model.'],
      aiWork: [
        'Перенёс формирование условий и форматирование дедлайна в чистые функции сущности.',
      ],
      keyPrompts: ['Вынести вычисления из GhostApplicationCard в model.'],
      outcome:
        'UI-компонент отвечает только за отображение; поведение сохранено.',
    },
  ],
  decisions: [
    'Не добавлять сервер, БД и авторизацию: они вне требований mock API.',
  ],
  aiCorrections: [
    {
      issue: 'Node-тест не сопоставлял относительные MSW routes без origin.',
      correction:
        'В тесте задан localhost origin; browser-конфигурация остаётся с baseUrl /api.',
    },
  ],
  futureImprovements: [
    'Добавить экран AI Worklog после реализации интерфейса.',
  ],
};
