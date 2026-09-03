import { createOpenApiHttp } from 'openapi-msw';

import type { ApiPaths } from '../schema';

export const http = createOpenApiHttp<ApiPaths>({ baseUrl: '/api' });
