import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

export function ReportPage() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50'>
      <CardHeader>
        <CardTitle>Отчёт</CardTitle>
      </CardHeader>
      <CardContent className='text-muted-foreground'>
        Экран отчёта будет добавлен следующим этапом.
      </CardContent>
    </Card>
  );
}

export const Component = ReportPage;
