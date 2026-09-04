import { ReportSummary } from '@/widgets/report-summary';

export function ReportPage() {
  return (
    <section className='space-y-8'>
      <header className='max-w-2xl'>
        <p className='text-sm font-medium text-primary'>Финальная сводка</p>
        <h2 className='mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'>
          Отчёт по переселению
        </h2>
        <p className='mt-3 text-base leading-7 text-muted-foreground'>
          Статус расселения, критические заявки и места, которым требуется внимание.
        </p>
      </header>
      <ReportSummary />
    </section>
  );
}

export const Component = ReportPage;
