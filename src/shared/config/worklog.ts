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
  tokenSummary:
    'Инструмент не предоставляет статистику токенов; токены не считались',
  stages: [
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
