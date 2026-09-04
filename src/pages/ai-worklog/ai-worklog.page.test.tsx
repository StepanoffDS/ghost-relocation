import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AiWorklogPage } from './ai-worklog.page';

describe('AiWorklogPage', () => {
  it('Показывает обязательные разделы', () => {
    render(<AiWorklogPage />);

    expect(screen.getByRole('heading', { name: 'AI Worklog' })).toBeTruthy();
    expect(screen.getByText('Использованные инструменты')).toBeTruthy();
    expect(screen.getByText('Этапы работы')).toBeTruthy();
    expect(screen.getByText('Что исправлено вручную')).toBeTruthy();
    expect(
      screen.getAllByText((content) => content.replace(/\D/g, '') === '46991438'),
    ).toHaveLength(2);
  });

  it('Раскрывает этапы через accordion', () => {
    render(<AiWorklogPage />);

    const stage = screen.getByRole('button', { name: /ТЗ и декомпозиция/ });

    expect(stage.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(stage);
    expect(stage.getAttribute('aria-expanded')).toBe('true');
  });
});
