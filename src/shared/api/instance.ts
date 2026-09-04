import createClient from 'openapi-fetch';

import type { ApiPaths } from './schema';

export const api = createClient<ApiPaths>({
  baseUrl: import.meta.env.MODE === 'test' ? 'http://localhost/api' : '/api',
  fetch: (...args) => globalThis.fetch(...args),
});
