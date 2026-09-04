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
  tokenUsage: {
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    reasoningOutputTokens: number;
    totalTokens: number;
  };
  tokenSummary: string;
  stages: WorklogStage[];
  decisions: string[];
  aiCorrections: { issue: string; correction: string }[];
  futureImprovements: string[];
};

export const worklog: AiWorklog = {
  generatedAt: '2026-09-04',
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
    {
      name: 'shadcn CLI',
      purpose: 'Добавление локального компонента Dialog',
      tokenCount: null,
    },
  ],
  totalDurationMinutes: null,
  tokenUsage: {
    inputTokens: 46725758,
    cachedInputTokens: 44435712,
    outputTokens: 246521,
    reasoningOutputTokens: 91970,
    totalTokens: 46991438,
  },
  tokenSummary:
    'Статистика токенов предоставлена для текущей AI-сессии и отображается с разделителями тысяч.',
  stages: [
    {
      name: 'ТЗ и декомпозиция',
      durationMinutes: null,
      developerWork: [
        'Определил границы MVP: React SPA, mock API в браузере, без сервера, БД и авторизации.',
      ],
      aiWork: ['Помог разложить требования на экраны, API и проверяемые сценарии.'],
      keyPrompts: ['Проанализировать task.md и определить минимальный объём реализации.'],
      outcome:
        'Границы и критерии готовности зафиксированы в task.md, docs/backend.md и docs/frontend.md; время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Архитектура',
      durationMinutes: null,
      developerWork: [
        'Выбрал FSD-слои, OpenAPI как источник API-типов и MSW для stateful mock API.',
      ],
      aiWork: [
        'Подготовил структуру запросов, handlers и чистую domain-функцию правил подбора.',
      ],
      keyPrompts: ['Реализовать mock backend по контракту из docs/backend.md.'],
      outcome:
        'Предметный UI использует только HTTP-клиент, а правила распределения не дублируются в React; время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Подготовка ручного назначения',
      durationMinutes: null,
      developerWork: [
        'Запросил установить локальный Dialog и сохранил существующую реализацию Button.',
      ],
      aiWork: [
        'Установил Dialog через shadcn CLI и проверил lint.',
      ],
      keyPrompts: ['Установи Dialog через npx shadcn@latest add Dialog.'],
      outcome:
        'Локальный Dialog доступен в shared/ui/kit; время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Ручное изменение решения',
      durationMinutes: null,
      developerWork: [
        'Выбрал двухшаговое подтверждение, чтобы конфликт нельзя было сохранить случайным действием.',
      ],
      aiWork: [
        'Добавил мутацию ручного назначения, диалог выбора места и отображение причин ответа 409.',
        'Проверил в браузере конфликтный выбор и последующее принудительное сохранение.',
      ],
      keyPrompts: [
        'Пользователь может вручную выбрать другое место. Если выбор плохой, приложение должно предупредить, что именно не так.',
      ],
      outcome:
        'Оператор видит причины конфликта и может подтвердить его отдельной destructive-кнопкой; время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Mock API и алгоритм',
      durationMinutes: null,
      developerWork: [
        'Утвердил контракт, fixtures и детерминированные правила совместимости.',
      ],
      aiWork: [
        'Создал OpenAPI-схему, MSW handlers, in-memory store и тесты.',
        'Добавил условие «боится яркого света»: его конфликт с ярким местом возвращается отдельным blocker.',
      ],
      keyPrompts: ['Реализовать mock backend по контракту из docs/backend.md.'],
      outcome:
        'Mock API готов; причины невозможного переселения включают дедлайн, вместимость, яркий свет и особые условия. Фактическое время будет заполнено при финальной проверке приложения.',
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
    {
      name: 'Финальный отчёт',
      durationMinutes: null,
      developerWork: [
        'Выбрал расширить агрегированный endpoint именем заявки, чтобы экран отчёта не запрашивал предметные данные отдельно.',
        'Проверил отчёт в браузере на desktop и при ширине 375 px.',
      ],
      aiWork: [
        'Добавил типизированный query, отчётный виджет, loading/error/empty состояния и тест mock API.',
        'Сгенерировал OpenAPI-типы и выполнил lint, test и build.',
      ],
      keyPrompts: [
        'Финальный отчёт: покажи расселённых, оставшихся без места, проблемные заявки и перегруженные места.',
      ],
      outcome:
        'Отчёт получает данные только из GET /reports/relocation; lint, 6 тестов и production-сборка проходят. Время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Упрощение итогового отчёта',
      durationMinutes: null,
      developerWork: [
        'Выбрал локальный компонент списка вместо универсальной абстракции для двух похожих блоков.',
      ],
      aiWork: [
        'Вынес отображение заполненных и перегруженных мест из основного компонента отчёта.',
      ],
      keyPrompts: ['Этот кусок кода выглядит перегруженно. Придумай что-нибудь.'],
      outcome:
        'Основной компонент отчёта оставляет только композицию секций; yarn lint, yarn test и yarn build проходят. Время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Упрощение списка проблемных заявок',
      durationMinutes: null,
      developerWork: [
        'Выбрал повторить локальный паттерн списка, не создавая общий компонент для двух случаев.',
      ],
      aiWork: [
        'Вынес отображение проблемных заявок и пустого состояния из основного компонента отчёта.',
      ],
      keyPrompts: ['Отрефактори как ты делал ранее.'],
      outcome:
        'Основной компонент отчёта оставляет только композицию секций; yarn lint, yarn test и yarn build проходят. Время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Расширение автотестов',
      durationMinutes: null,
      developerWork: [
        'Выбрал покрыть обязательные UI-сценарии и переполнение fixture без e2e-инфраструктуры.',
      ],
      aiWork: [
        'Подключил React Testing Library и jsdom, добавил компонентные проверки причин отказа, 409-подтверждения и error-state через server.use().',
        'Добавил проверку full fixture, настроил Vitest для DOM-окружения и сократил русские названия тестов.',
      ],
      keyPrompts: ['Все пункты из ТЗ выполнены, но не хватает тестов. Добавь тесты.'],
      outcome:
        'Vitest выполняет 10 тестов; yarn lint, yarn test и yarn build проходят. Время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Выделение навигации',
      durationMinutes: null,
      developerWork: [
        'Выбрал отдельный компонент навигации внутри виджета без расширения его публичного API.',
      ],
      aiWork: [
        'Вынес ссылочную навигацию из AppShell в AppNavigation и выполнил проверки.',
      ],
      keyPrompts: ['Вынеси в отдельный компонент.'],
      outcome:
        'AppShell отвечает за layout, AppNavigation — за навигационные ссылки; yarn lint, yarn test и yarn build проходят. Время этапа отдельно не фиксировалось.',
    },
    {
      name: 'Закрытие обязательных сценариев',
      durationMinutes: null,
      developerWork: [
        'Выбрал сделать все edge cases доступными из обычного интерфейса, а не только через mock API.',
        'Проверил в браузере пустой набор, ручной конфликт и итоговый отчёт.',
      ],
      aiWork: [
        'Добавил selector demo-наборов с инвалидацией связанных запросов.',
        'Исправил повтор запросов доски и добавил отображение ручных решений с предупреждениями в отчёте.',
      ],
      keyPrompts: ['Реализуй доработки из аудита проекта.'],
      outcome:
        'Обязательные сценарии доступны из шапки приложения; Vitest выполняет 12 тестов, lint, api:check и production-сборка проходят.',
    },
    {
      name: 'AI Worklog',
      durationMinutes: null,
      developerWork: [
        'Запросил отдельный экран с фактическими данными из конфигурации и раскрывающимися этапами на shadcn Accordion.',
      ],
      aiWork: [
        'Собрал адаптивный экран с инструментами, timeline этапов, shadcn Accordion, решениями, исправлениями и будущими улучшениями.',
      ],
      keyPrompts: [
        'Теперь сделай AI Worklog.',
        'В AI Worklog поставь accordion из Shadcn.',
      ],
      outcome:
        'Worklog открывается по /ai-worklog без API и README; этапы раскрываются локальным shadcn Accordion, а время и токены оставлены незаполненными, потому что они не фиксировались.',
    },
  ],
  decisions: [
    'Не добавлять сервер, БД и авторизацию: они вне требований mock API.',
    'Хранить правила подбора в чистой mock domain-функции, а не дублировать их в React-компонентах.',
    'Сохранять подтверждённое конфликтное назначение только после отдельного destructive-действия.',
    'Показывать обязательные edge cases через selector demo-наборов в интерфейсе.',
  ],
  aiCorrections: [
    {
      issue:
        'Клиент API захватывал fetch до запуска MSW-сервера, поэтому компонентные тесты не видели handlers.',
      correction:
        'Клиент вызывает текущий global fetch; абсолютный base URL используется только в test-режиме.',
    },
  ],
  futureImprovements: [
    'Подключить настоящий backend, постоянное хранилище и журнал изменений назначений.',
    'Добавить фильтры, поиск и сортировку заявок для большого количества обращений.',
    'Сделать доступными отмену назначения и пакетное распределение с предпросмотром.',
    'Добавить e2e-проверки пользовательских сценариев в реальном браузере.',
  ],
};
