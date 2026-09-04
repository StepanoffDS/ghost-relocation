import { Ghost } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { DemoReset } from '@/features/demo-reset';

import { AppNavigation } from './app-navigation';

export function AppShell() {
  return (
    <main className='min-h-svh bg-[radial-gradient(circle_at_top_right,oklch(0.33_0.12_303/.4),transparent_36%),radial-gradient(circle_at_bottom_left,oklch(0.25_0.06_250/.4),transparent_38%)]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10'>
        <header className='mb-10 flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase'>
              <Ghost className='size-4' aria-hidden='true' /> Бюро переселения
            </p>
            <h1 className='text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
              Привидения без прописки
            </h1>
          </div>
          <div className='flex flex-wrap items-end gap-5'>
            <AppNavigation />
            <DemoReset />
          </div>
        </header>
        <Outlet />
      </div>
    </main>
  );
}
