# ТЗ: frontend

## 1. Назначение и стек

Клиент — SPA на React, TypeScript и Vite. Он показывает операторский сценарий, получает все предметные данные только по HTTP из mock API и не содержит копий seed-данных или логики MSW.

- React 19 + TypeScript strict;
- Vite;
- React Router: `/`, `/places`, `/report`, `/ai-worklog`, `*`;
- Tailwind CSS v4;
- shadcn/ui только для нужных компонентов;
- TanStack Query + `openapi-fetch`;
- Vitest + React Testing Library.

Vite настраивается с alias `@ → ./src` и Tailwind Vite plugin. `components.json` shadcn/ui использует этот alias, а сгенерированные UI-компоненты располагаются в `src/shared/ui/kit`. Базовый импорт в `app/index.css` — `@import "tailwindcss";`.

`useReducer` и Context допустимы только для локального UI-состояния, которое меняется из многих вложенных компонентов: активный demo-набор, открытый диалог и подтверждение ручного конфликта. Серверные данные и мутации хранятся в TanStack Query. Не добавлять Redux, Zustand, React Hook Form или отдельную state-machine.

## 2. FSD

Структура вдохновлена [`booking-rooms`](https://github.com/StepanoffDS/booking-rooms): `app` задаёт providers и маршруты, `pages` компонуются из сегментов, сценарии лежат в `features`, предметные сущности — в `entities`, повторно используемая инфраструктура — в `shared`.

```text
src/
  app/
    main.tsx
    providers.tsx
    router.tsx
    index.css
  pages/
    relocation/
    places/
    report/
    ai-worklog/
    not-found/
  widgets/
    app-shell/
    relocation-board/
    places-list/
    report-summary/
  features/
    auto-assign/
    manual-relocation/
    demo-reset/
  entities/
    ghost/
    place/
    relocation/
  shared/
    api/
      instance.ts
      query-client.ts
      schema/
    config/
      worklog.ts
    lib/
    model/
    test/
    ui/
      kit/
      error-state.tsx
      page-loader.tsx
```

Правила импорта:

- `app` может импортировать все нижние слои;
- `pages` — `widgets`, `features`, `entities`, `shared`;
- `widgets` — `features`, `entities`, `shared`;
- `features` — `entities`, `shared`;
- `entities` — только `shared`;
- сегменты не импортируют внутренние файлы друг друга: только публичный `index.ts`;
- `shared` не зависит от слоёв выше.

Не создавать слои `processes`, `services`, `common`, `utils` и папки «на будущее». `compose/` используется внутри крупного сегмента, если композиция страницы не помещается в один компонент; `model/` — только для hooks, reducer и чистых функций.

## 3. API и состояние

`shared/api/instance.ts` создаёт `openapi-fetch` client из `ApiPaths` и base URL `/api`. API-hooks лежат рядом с сущностью:

```text
entities/ghost/api/use-ghosts.ts
entities/place/api/use-places.ts
entities/relocation/api/use-relocations.ts
entities/relocation/api/use-relocation-report.ts
```

Мутации принадлежат пользовательскому действию:

```text
features/auto-assign/api/use-auto-assign.ts
features/manual-relocation/api/use-manual-relocation.ts
features/demo-reset/api/use-demo-reset.ts
```

После успешного `auto-assign`, `manual-relocation` или `demo-reset` инвалидировать `ghosts`, `places`, `relocations`, `report`. Не обновлять occupancy вручную в нескольких компонентах.

## 4. Маршруты и экраны

### `/` — Распределение

Первый экран. В шапке: название, nav, селектор demo-набора. Ниже:

- краткая инструкция и кнопка «Распределить автоматически»;
- KPI: расселено, без места, заполнено/перегружено;
- `RelocationBoard`: список заявок с именем, дедлайном, тегами условий, текущим местом, статусом, баллом и объяснением;
- действие «Изменить место» открывает `ManualRelocationDialog`;
- загрузка — skeleton, ошибка — `ErrorState`, пустой ответ — ясный empty state.

Первоначально назначения могут быть `unassigned`; пользователь запускает автораспределение сам. Это делает основной сценарий очевидным.

### `/places` — Места

Сетка карточек. Каждая показывает тип, характеристики, ограничения, `occupied / capacity` и статус «Свободно», «Заполнено» или «Перегружено». Данные не дублируются: заполненность приходит от `/places`.

### `/report` — Отчёт

Карточки итогов, список наиболее проблемных заявок, заполненные/перегруженные места и ручные решения с warnings. Экран читает только `GET /reports/relocation`.

### `/ai-worklog` — AI Worklog

Экран реализуется строго по [ai-worklog.md](ai-worklog.md). Он получает фактические данные из `shared/config/worklog.ts`, а не из API и не из README.

### `*` — Not found

Короткая 404-страница с кнопкой перехода к распределению.

## 5. Сценарии и компоненты

### Автораспределение

`features/auto-assign` владеет кнопкой, pending-состоянием, toast успеха/ошибки и вызовом mutation. Расчёты не дублируются на фронтенде: UI показывает score и explanations ответа API.

### Ручное назначение

`ManualRelocationDialog` использует shadcn `Dialog`, `Select`, `Alert`, `Button`.

1. Пользователь выбирает локацию.
2. Mutation с `force: false` сохраняет решение либо возвращает `409`.
3. При `409` в dialog выводится каждый warning/blocker.
4. Только кнопка «Подтвердить несмотря на предупреждения» повторяет запрос с `force: true`.
5. При ошибке сети dialog остаётся открытым; пользователь не теряет выбор.

### Demo-наборы

`DemoReset` — компактный Select в шапке. По подтверждению вызывает `/demo/reset`, затем обновляет все queries. Выбор `empty`, `impossible`, `full`, `manual-conflict` служит проверяемой демонстрацией обязательных edge cases, а не скрытой developer-панелью.

## 6. UI

Использовать shadcn components через локальные файлы `shared/ui/kit`, а не импортировать из внешнего CDN. Добавить только `button`, `card`, `badge`, `tabs`, `select`, `dialog`, `alert`, `skeleton`, `tooltip` и toast-компонент, если он реально используется.

Tailwind отвечает за layout, responsive стили и варианты. Токены цветов и радиусов задать в `app/index.css`; не создавать отдельную дизайн-систему. Визуальный характер: спокойный тёмный графит, один выразительный акцент, крупная типографика, короткие тексты, заметные статусы. Не копировать бренд MOX.

Обязательно:

- desktop 1440 px и mobile 375 px;
- семантические button/input/label;
- видимый focus; контрастный текст; не использовать цвет как единственный сигнал;
- `aria-describedby` у конфликтов и доступные названия у icon-only buttons;
- не заменять нативный выбор даты или select самописными компонентами без причины.

## 7. Ошибки

`shared/ui/error-state.tsx` принимает заголовок, описание, действие «Повторить». Страница не должна падать при 4xx/5xx или сетевой ошибке: TanStack Query переводит query в error-state, mutation — в toast или alert внутри dialog.

Отдельный тест через `server.use()` должен эмулировать `500` от `/ghosts` и проверить понятное сообщение с кнопкой повтора.

## 8. Тесты

Минимум автоматических тестов:

1. `RelocationBoard` показывает причины `unassigned` заявки.
2. `ManualRelocationDialog` выводит `409`-предупреждения и посылает второй запрос только после явного подтверждения.
3. Экран распределения показывает error-state при `500`.
4. После выбора demo-набора отображается соответствующий empty/full сценарий.

Также в финальном README реализации перечислить ручные сценарии: пустой список, нет подходящего места, переполнение, ручной конфликт, ошибка API, mobile-проверка.

## 9. Приёмка

- Нет импортов MSW вне `shared/api/mocks` и bootstrap в `app/main.tsx`.
- Нет business-логики подбора в React-компонентах.
- Каждый route имеет loading, empty или error состояние там, где это применимо.
- Ручное конфликтное решение невозможно сохранить случайным одиночным кликом.
- Сборка, lint, typecheck и тесты проходят до сдачи.
