import createClient from 'openapi-fetch';

import type { ApiPaths } from './schema';

export const api = createClient<ApiPaths>({ baseUrl: '/api' });
