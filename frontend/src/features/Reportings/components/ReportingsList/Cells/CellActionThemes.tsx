import { displaySubThemes } from '@utils/getThemesAsOptions'

import type { ThemeFromAPI } from 'domain/entities/themes'

export function CellActionTheme({ theme }: { theme: ThemeFromAPI }) {
  const content = [theme.name, displaySubThemes([theme])].join(': ')

  return content !== '' ? (
    <span data-cy="cell-theme" title={content}>
      {content}
    </span>
  ) : null
}
