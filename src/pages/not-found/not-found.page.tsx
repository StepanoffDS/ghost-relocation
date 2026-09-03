import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

function NotFoundPage() {
  return (
    <Card className='max-w-xl border-dashed border-border/80 bg-card/50'><CardHeader><CardTitle>Страница не найдена</CardTitle></CardHeader><CardContent className='space-y-4 text-muted-foreground'><p>Проверьте адрес или вернитесь к заявкам.</p><Link className='inline-flex h-9 items-center rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80' to={ROUTES.RELOCATION}>К заявкам</Link></CardContent></Card>
  );
}

export const Component = NotFoundPage;
