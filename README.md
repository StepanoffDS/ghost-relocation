# Бюро переселения привидений

React/Vite SPA для оператора бюро. Предметный HTTP API пока работает в браузере через MSW; его контракт лежит в OpenAPI и не требует настоящего сервера, БД или авторизации.

## Запуск

Требуется Node.js 20+ и Yarn 1.

```bash
yarn
cp .env.example .env
yarn dev
```

`VITE_USE_MOCKS=true` запускает Service Worker до рендера React. Если он не зарегистрируется, приложение покажет инфраструктурную ошибку вместо запросов к несуществующему серверу.

## Mock API

Контракт: [`src/shared/api/schema/main.yaml`](src/shared/api/schema/main.yaml). Маршруты имеют базовый путь `/api`:

- `GET /ghosts`, `GET /places`, `GET /relocations`;
- `POST /relocations/auto-assign`;
- `PUT /relocations/{ghostId}` с `{ placeId, force }`;
- `GET /reports/relocation`;
- `POST /demo/reset` с одним из fixture: `default`, `empty`, `impossible`, `full`, `manual-conflict`.

Данные хранятся только в памяти Service Worker. Обновление страницы возвращает fixture `default`.

## Проверки

```bash
yarn api:generate
yarn test
yarn lint
yarn build
```

`yarn api:check` регенерирует типы и проверяет, что `generated.ts` не отличается от контракта; эта команда требует Git-репозиторий.

Автотесты проверяют детерминированное автораспределение с учётом вместимости, все блокеры невозможной заявки, обязательное подтверждение ручного конфликта и сброс fixture.
