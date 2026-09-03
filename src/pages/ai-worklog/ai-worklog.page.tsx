import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

export function AiWorklogPage() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50'><CardHeader><CardTitle>AI Worklog</CardTitle></CardHeader><CardContent className='text-muted-foreground'>Экран worklog будет добавлен следующим этапом.</CardContent></Card>
  );
}

export const Component = AiWorklogPage;
