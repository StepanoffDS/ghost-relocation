import './index.css';

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from './providers';
import { router } from './router';

const root = createRoot(document.getElementById('root')!);
document.documentElement.classList.add('dark');

const start = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('@/shared/api/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  root.render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
};

void start().catch((cause: unknown) => {
  root.render(
    <p role='alert'>
      Не удалось запустить mock API. Проверьте Service Worker и перезагрузите
      страницу.
    </p>,
  );
  console.error('Mock API bootstrap failed', cause);
});
