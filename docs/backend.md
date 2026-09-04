# ТЗ: mock backend

## 1. Назначение

Mock backend имитирует HTTP API, но работает в браузере через Service Worker. Фронтенд не знает о его реализации: он использует только OpenAPI-контракт и HTTP-клиент. Настоящий backend в будущем должен повторить этот контракт.

Подход вдохновлён [`miro-copy`](https://github.com/StepanoffDS/miro-copy): единый OpenAPI-файл, генерируемые типы, `openapi-msw` для типизированных handlers, `setupWorker` в браузере и stateful данные в памяти. В отличие от референса, здесь **нет** auth, JWT, cookie, refresh-token и защищённых маршрутов — этого нет в [task.md](../task.md).

## 2. Инструменты

- `openapi-typescript` — генерирует типы `paths` и `components` из OpenAPI 3.0.
- `openapi-msw` — создаёт типизированный `http` из сгенерированных `paths`.
- `msw` — перехватывает реальные запросы браузера через `setupWorker`.
- `openapi-fetch` — типизированный HTTP-клиент фронтенда.

OpenAPI — единственный источник типов API. Типы в `generated.ts` нельзя редактировать вручную.

## 3. Файловая структура

```text
src/shared/api/
  instance.ts
  schema/
    main.yaml
    endpoints/
      ghosts.yaml
      places.yaml
      relocations.yaml
      reports.yaml
      demo.yaml
    shared/
      schemas.yaml
      responses.yaml
    generated.ts                 # результат генерации, не редактировать
    index.ts                     # ApiPaths, ApiComponents, ApiSchemas
  mocks/
    browser.ts
    http.ts
    index.ts
    store.ts
    seed.ts
    domain/
      relocation-rules.ts
    handlers/
      ghosts.ts
      places.ts
      relocations.ts
      reports.ts
      demo.ts
```

`src/shared/api/mocks` — часть инфраструктуры. Бизнес-правила вынесены в чистую функцию `domain/relocation-rules.ts`, чтобы handler не превратился в большой контроллер и мог тестироваться без MSW.

## 4. Контракт и генерация

Корневой `main.yaml` содержит только метаданные, server `/api` и ссылки на endpoint-файлы. Повторяющиеся DTO и ошибки лежат в `shared/`.

```json
{
  "scripts": {
    "api:generate": "openapi-typescript src/shared/api/schema/main.yaml -o src/shared/api/schema/generated.ts",
    "api:check": "npm run api:generate && git diff --exit-code -- src/shared/api/schema/generated.ts"
  }
}
```

После изменения YAML обязательно запустить `api:generate`; в CI — `api:check`. Новый endpoint нельзя сначала писать в handler или API-hook: сначала контракт, затем типы, handler и клиент.

## 5. Модели API

### Ghost

```yaml
Ghost:
  required: [id, name, anxiety, preferredTemperature, deadline, requirements]
  properties:
    id: { type: string, format: uuid }
    name: { type: string }
    anxiety: { type: integer, minimum: 1, maximum: 5 }
    preferredTemperature: { type: integer, minimum: -30, maximum: 50 }
    deadline: { type: string, format: date }
    requirements:
      $ref: '#/components/schemas/GhostRequirements'
    note: { type: string, nullable: true }
```

`GhostRequirements` содержит `needsAttic`, `avoidsMirrors`, `noHumans`, `lovesHumidity` — все boolean.

### Place

```yaml
Place:
  required:
    [
      id,
      name,
      type,
      capacity,
      temperature,
      lighting,
      noise,
      humidity,
      hasHumans,
      hasAttic,
      hasMirrors,
      restrictions,
    ]
  properties:
    id: { type: string, format: uuid }
    name: { type: string }
    type:
      { type: string, enum: [castle, lighthouse, library, theater, basement] }
    capacity: { type: integer, minimum: 1 }
    temperature: { type: integer }
    lighting: { type: string, enum: [low, medium, high] }
    noise: { type: string, enum: [low, medium, high] }
    humidity: { type: string, enum: [low, medium, high] }
    hasHumans: { type: boolean }
    hasAttic: { type: boolean }
    hasMirrors: { type: boolean }
    restrictions:
      type: array
      items: { type: string }
```

Занятость места не хранится в `Place`: она всегда вычисляется из назначений. Так state не расходится после ручного переназначения.

### Relocation

```yaml
Relocation:
  required: [ghostId, placeId, mode, score, issues]
  properties:
    ghostId: { type: string, format: uuid }
    placeId: { type: string, format: uuid, nullable: true }
    mode: { type: string, enum: [auto, manual, unassigned] }
    score: { type: integer, minimum: 0, maximum: 100, nullable: true }
    issues:
      type: array
      items: { $ref: '#/components/schemas/RelocationIssue' }
```

`RelocationIssue` имеет `code`, `message` и `severity` (`blocker` или `warning`). API возвращает понятное `message`, а frontend может использовать `code` для иконки и локализации.

`GET /places` возвращает `PlaceWithOccupancy`: все поля `Place` плюс `occupied` и `isOverloaded`. Это read-модель, не отдельное изменяемое хранилище.

## 6. Endpoints

| Метод  | Путь                           | Поведение                                                                        |
| ------ | ------------------------------ | -------------------------------------------------------------------------------- |
| `GET`  | `/api/ghosts`                  | Возвращает все заявки текущего demo-набора.                                      |
| `GET`  | `/api/places`                  | Возвращает места; `occupied` и `isOverloaded` добавляются read-моделью ответа.   |
| `GET`  | `/api/relocations`             | Возвращает текущее решение по каждой заявке.                                     |
| `POST` | `/api/relocations/auto-assign` | Выполняет автораспределение, сохраняет результат и возвращает список назначений. |
| `PUT`  | `/api/relocations/{ghostId}`   | Выполняет ручное назначение. Body: `placeId`, `force`.                           |
| `GET`  | `/api/reports/relocation`      | Возвращает итоговую агрегированную сводку.                                       |
| `POST` | `/api/demo/reset`              | Заменяет in-memory state выбранным fixture и возвращает его имя.                 |

`PUT /relocations/{ghostId}`:

- если заявка или место не найдены — `404 NOT_FOUND`;
- если место конфликтно или переполнено и `force: false` — `409 RELOCATION_CONFLICT` с полным `issues`;
- если `force: true` — сохраняет ручное решение даже с предупреждениями;
- `placeId: null` отменяет ручное назначение и переводит заявку в `unassigned`.

`POST /relocations/auto-assign` сохраняет ручные решения и учитывает занятую ими вместимость. Он пересчитывает только `auto` и `unassigned` заявки; повторный запуск не должен молча отменять подтверждённое решение оператора.

Все ошибки используют одну форму:

```json
{
  "error": {
    "code": "RELOCATION_CONFLICT",
    "message": "Выбранное место нарушает условия заявки",
    "details": { "issues": [] }
  }
}
```

## 7. Правила автораспределения

### Блокеры

Место исключается, если:

- дедлайн уже прошёл — `DEADLINE_EXPIRED`;
- `occupied >= capacity` — `CAPACITY_FULL`;
- нужен чердак, но `hasAttic = false` — `ATTIC_REQUIRED`;
- заявка боится яркого света, а `lighting = high` — `BRIGHT_LIGHT_FORBIDDEN`;
- заявка боится зеркал и `hasMirrors = true` — `MIRRORS_FORBIDDEN`;
- нельзя рядом с людьми и `hasHumans = true` — `HUMANS_FORBIDDEN`;
- нужна сырость и `humidity !== high` — `HUMIDITY_REQUIRED`;
- текстовое ограничение места совпало с condition заявки — `PLACE_RESTRICTION`.

### Балл совместимости

Для места без блокеров:

- температура: `max(0, 40 - 4 * abs(place.temperature - ghost.preferredTemperature))`;
- освещение: `low = 20`, `medium = 12`, `high = 4` при тревожности 4–5; для 1–3 — `12`;
- шум: аналогично освещению;
- влажность: `10` за `high`, если требуется сырость; иначе `5`;
- вместимость: `10`, если после назначения остаётся хотя бы одно место, иначе `4`.

Сумма ограничивается диапазоном 0–100. Для каждого балла API возвращает краткое объяснение в `issues` с severity `warning` либо отдельном поле `explanation` read-модели.

Перед распределением заявки сортируются по числу допустимых мест по возрастанию, затем по дедлайну, затем по тревожности по убыванию. При равном балле выбирается место с большим остатком вместимости, затем с лексикографически меньшим `id`: результат должен быть детерминированным.

## 8. In-memory store и fixtures

`store.ts` экспортирует маленький stateful API: `getState`, `replaceState`, `reset`, `assign`, `unassign`. Только handlers используют store; UI никогда не импортирует его.

`seed.ts` содержит фиксированные, неслучайные данные. После обновления страницы worker создаёт state заново; постоянное хранилище не нужно.

Fixtures:

- `default` — несколько хороших назначений и одна сложная заявка;
- `empty` — заявок нет;
- `impossible` — у каждой локации есть блокер;
- `full` — подходящее место заполнено;
- `manual-conflict` — есть место, которое можно выбрать только с предупреждением.

`POST /demo/reset` принимает `{ "fixture": "default" }`. Фронтенд вызывает его из селектора «Демо-набор», после чего инвалидирует все API queries.

## 9. MSW bootstrap

`http.ts` создаёт `createOpenApiHttp<ApiPaths>({ baseUrl: '/api' })`. Каждый файл в `handlers/` экспортирует массив handlers; `index.ts` объединяет их. `browser.ts` создаёт один `worker = setupWorker(...handlers)`.

В `main.tsx` worker запускается **до** `createRoot`, только при `VITE_USE_MOCKS=true`. При невозможности зарегистрировать worker приложение показывает понятную инфраструктурную ошибку; оно не должно молча делать запросы в несуществующий backend.

В тестах использовать `setupServer(...handlers)` из `msw/node`, а не браузерный worker. Для отдельного error-сценария тест временно добавляет `server.use(...)` и проверяет error-state UI.

## 10. Проверки mock API

Минимум:

1. `auto-assign` не превышает вместимость и отдаёт стабильный результат.
2. Неподходящая заявка возвращается как `unassigned` со всеми блокерами.
3. Ручной конфликт возвращает `409`, пока не передан `force: true`.
4. `reset` восстанавливает исходное состояние и не сохраняет изменения прошлого fixture.
5. Схема генерируется без diff (`api:check`).
