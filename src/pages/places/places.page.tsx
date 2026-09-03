import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

export function PlacesPage() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50'><CardHeader><CardTitle>Места переселения</CardTitle></CardHeader><CardContent className='text-muted-foreground'>Экран мест будет добавлен следующим этапом.</CardContent></Card>
  );
}

export const Component = PlacesPage;
