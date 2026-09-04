import { NavLink } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/css';

const links = [
  { to: ROUTES.RELOCATION, label: 'Заявки', end: true },
  { to: ROUTES.PLACES, label: 'Места' },
  { to: ROUTES.REPORT, label: 'Отчёт' },
  { to: ROUTES.AI_WORKLOG, label: 'AI Worklog' },
];

export function AppNavigation() {
  return (
    <nav aria-label='Основная навигация'>
      <ul className='flex flex-wrap gap-1'>
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive &&
                    'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                )
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
