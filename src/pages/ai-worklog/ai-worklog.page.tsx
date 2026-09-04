import { Bot, CalendarDays, Clock3, Sparkles } from 'lucide-react';

import { worklog } from '@/shared/config/worklog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/kit/accordion';
import { Badge } from '@/shared/ui/kit/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

const formatDuration = (minutes: number | null) =>
  minutes === null ? 'Не зафиксировано' : `${minutes} мин`;

const formatTokenCount = (tokens: number) =>
  new Intl.NumberFormat('ru-RU').format(tokens);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  );

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className='space-y-2 text-sm leading-6 text-muted-foreground'>
      {items.map((item) => (
        <li key={item} className='flex gap-2'>
          <span className='mt-2 size-1.5 shrink-0 rounded-full bg-primary' />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AiWorklogPage() {
  return (
    <section className='space-y-8' aria-label='AI Worklog'>
      <header className='max-w-3xl'>
        <p className='mb-3 flex items-center gap-2 text-sm font-medium text-primary'>
          <Sparkles className='size-4' aria-hidden='true' /> Прозрачный процесс
        </p>
        <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
          AI Worklog
        </h2>
        <p className='mt-3 text-base leading-7 text-muted-foreground'>
          Факты о разработке этого демо: где помог AI, а где решения и проверки
          оставались за разработчиком.
        </p>
      </header>

      <div className='grid gap-4 sm:grid-cols-3'>
        <MetricCard icon={Clock3} label='Общее время' value={formatDuration(worklog.totalDurationMinutes)} />
        <MetricCard icon={Bot} label='Токены' value={formatTokenCount(worklog.tokenUsage.totalTokens)} />
        <MetricCard icon={CalendarDays} label='Обновлено' value={formatDate(worklog.generatedAt)} />
      </div>

      <Card className='border-border/70 bg-card/75'>
        <CardHeader>
          <CardTitle>Использованные инструменты</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='grid gap-3 md:grid-cols-3'>
            {worklog.tools.map((tool) => (
              <li key={tool.name} className='rounded-md bg-muted/60 p-3'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='font-medium'>{tool.name}</p>
                  <Badge variant='outline'>
                    {tool.tokenCount === null ? 'Токены не считались' : tool.tokenCount}
                  </Badge>
                </div>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  {tool.purpose}
                </p>
              </li>
            ))}
          </ul>
          <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
            <TokenStat label='Входные' value={worklog.tokenUsage.inputTokens} />
            <TokenStat label='Кешированные входные' value={worklog.tokenUsage.cachedInputTokens} />
            <TokenStat label='Выходные' value={worklog.tokenUsage.outputTokens} />
            <TokenStat label='Reasoning output' value={worklog.tokenUsage.reasoningOutputTokens} />
            <TokenStat label='Всего' value={worklog.tokenUsage.totalTokens} />
          </div>
          <p className='mt-4 text-sm text-muted-foreground'>
            {worklog.tokenSummary}
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby='stages-title'>
        <h3 id='stages-title' className='text-xl font-semibold tracking-tight'>
          Этапы работы
        </h3>
        <Accordion
          className='mt-4 gap-4 overflow-visible rounded-none border-0 border-l bg-transparent pl-5'
          defaultValue={[worklog.stages.at(-1)?.name ?? '']}
        >
          {worklog.stages.map((stage) => (
            <AccordionItem
              key={stage.name}
              value={stage.name}
              className='relative overflow-visible rounded-lg border border-border/70 bg-card/75 data-open:bg-card/75'
            >
              <span className='absolute -left-[1.78rem] top-5 size-3 rounded-full border-2 border-background bg-primary' />
              <AccordionTrigger className='p-4 text-base no-underline hover:no-underline'>
                <span className='flex min-w-0 flex-wrap items-center gap-2'>
                  <span>{stage.name}</span>
                  <Badge variant='outline'>{formatDuration(stage.durationMinutes)}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent className='px-2 pt-1'>
                <div className='mt-5 grid gap-5 lg:grid-cols-3'>
                  <WorkColumn title='Сделал разработчик' items={stage.developerWork} />
                  <WorkColumn title='Помог AI' items={stage.aiWork} />
                  <WorkColumn title='Ключевые промпты' items={stage.keyPrompts} />
                </div>
                <p className='mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground'>
                  {stage.outcome}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className='grid gap-4 xl:grid-cols-3'>
        <InfoCard title='Мои решения' items={worklog.decisions} />
        <Card className='border-border/70 bg-card/75'>
          <CardHeader>
            <CardTitle>Что исправлено вручную</CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            {worklog.aiCorrections.map((correction) => (
              <div key={correction.issue} className='space-y-2'>
                <p className='text-sm font-medium'>{correction.issue}</p>
                <p className='text-sm leading-6 text-muted-foreground'>
                  {correction.correction}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <InfoCard title='Что улучшить в продукте' items={worklog.futureImprovements} />
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <Card className='border-border/70 bg-card/75'>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle className='text-muted-foreground'>{label}</CardTitle>
        <Icon className='size-4 text-primary' aria-hidden='true' />
      </CardHeader>
      <CardContent>
        <p className='text-xl font-semibold'>{value}</p>
      </CardContent>
    </Card>
  );
}

function TokenStat({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-md border border-border/70 bg-muted/40 p-3'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-1 font-mono text-sm font-semibold tabular-nums'>
        {formatTokenCount(value)}
      </p>
    </div>
  );
}

function WorkColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className='mb-3 text-sm font-medium'>{title}</h4>
      <BulletList items={items} />
    </section>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className='border-border/70 bg-card/75'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BulletList items={items} />
      </CardContent>
    </Card>
  );
}

export const Component = AiWorklogPage;
