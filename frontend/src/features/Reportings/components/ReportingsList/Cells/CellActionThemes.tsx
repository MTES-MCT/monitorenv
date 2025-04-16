import type { ThemeAPI } from 'domain/entities/themes'

export function CellActionTheme({ theme }: { theme: ThemeAPI }) {
  const content = [theme.name, theme.subThemes.map(subTheme => subTheme.name).join(', ')].join(': ')

  return content !== '' ? (
    <span data-cy="cell-theme" title={content}>
      {content}
    </span>
  ) : null
}
