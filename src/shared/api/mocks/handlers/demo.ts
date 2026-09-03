import type { ApiSchemas } from '../../schema';
import { http } from '../http';
import { reset } from '../store';

type DemoResetRequest = ApiSchemas['DemoResetRequest'];

export const demoHandlers = [
  http.post('/demo/reset', async ({ request, response }) => {
    const { fixture } = (await request.json()) as DemoResetRequest;
    reset(fixture);
    return response(200).json({ fixture });
  }),
];
