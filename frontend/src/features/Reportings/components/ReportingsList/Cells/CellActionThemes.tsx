import { displaySubThemes } from '@features/Themes/utils/getThemesAsOptions'

import type { ThemeAPI } from 'domain/entities/themes'

export function CellActionTheme({ theme }: { theme: ThemeAPI }) {
  const content = [theme.name, displaySubThemes(theme.subThemes)].join(': ')

  return content !== '' ? (
    <span data-cy="cell-theme" title={content}>
      {content}
    </span>
  ) : null
}
