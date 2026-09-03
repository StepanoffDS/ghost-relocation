import { createBrowserRouter, redirect } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { AppShell } from '@/widgets/app-shell';

import { RouterFallback } from './router-fallback';

export const router = createBrowserRouter([
  {
    Component: AppShell,
    HydrateFallback: RouterFallback,
    children: [
      { index: true, loader: () => redirect(ROUTES.RELOCATION) },
      {
        path: ROUTES.RELOCATION,
        lazy: () => import('@/pages/relocation/relocation.page'),
      },
      {
        path: ROUTES.PLACES,
        lazy: () => import('@/pages/places/places.page'),
      },
      {
        path: ROUTES.REPORT,
        lazy: () => import('@/pages/report/report.page'),
      },
      {
        path: ROUTES.AI_WORKLOG,
        lazy: () => import('@/pages/ai-worklog/ai-worklog.page'),
      },
      { path: '*', lazy: () => import('@/pages/not-found/not-found.page') },
    ],
  },
]);
