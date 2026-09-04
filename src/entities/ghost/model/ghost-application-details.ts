import type { ApiSchemas } from '@/shared/api/schema';

export const getGhostRequirements = (ghost: ApiSchemas['Ghost']): string[] => {
  const { requirements, note } = ghost;

  return [
    requirements.needsAttic && 'Нужен чердак',
    requirements.avoidsBrightLight && 'Боится яркого света',
    requirements.avoidsMirrors && 'Боится зеркал',
    requirements.noHumans && 'Не селить рядом с людьми',
    requirements.lovesHumidity && 'Любит сырость',
    note,
  ].filter((requirement): requirement is string => Boolean(requirement));
};

export const formatGhostDeadline = (deadline: string): string =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(
    new Date(`${deadline}T00:00:00`),
  );
