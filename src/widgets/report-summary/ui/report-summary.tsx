import { Building2, Ghost, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import { useRelocationReport } from '@/entities/relocation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

import { OverloadedPlaces } from './overloaded-places';
import { ProblematicGhosts } from './problematic-ghosts';
import { ErrorReport, PendingReport } from './report-states';

const metricCards = [
  { key: 'assignedCount', label: 'Расселено', icon: Ghost },
  { key: 'unassignedCount', label: 'Без места', icon: Users },
  { key: 'overloadedPlaces', label: 'Места на пределе', icon: Building2 },
] as const;

export function ReportSummary() {
  const report = useRelocationReport();

  if (report.isPending) return <PendingReport />;
  if (report.isError)
    return <ErrorReport onRetry={() => void report.refetch()} />;

  const data = report.data;
  if (!data) return null;

  return (
    <section className='space-y-8' aria-label='Итоги переселения'>
      <div className='grid gap-4 sm:grid-cols-3'>
        {metricCards.map(({ key, label, icon: Icon }) => {
          const value =
            key === 'overloadedPlaces' ? data[key].length : data[key];
          return (
            <Card key={key} className='border-border/70 bg-card/75'>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle className='text-muted-foreground'>{label}</CardTitle>
                <Icon className='size-4 text-primary' aria-hidden='true' />
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-semibold'>{value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ReportSection title='Самые проблемные заявки'>
        <ProblematicGhosts ghosts={data.problematicGhosts} />
      </ReportSection>

      <ReportSection title='Заполненные и перегруженные места'>
        <OverloadedPlaces places={data.overloadedPlaces} />
      </ReportSection>
    </section>
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className='border-border/70 bg-card/75'>
      <CardHeader>
        <CardTitle className='text-lg'>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
