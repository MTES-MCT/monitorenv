import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'
import { displaySubThemes } from '@utils/getThemesAsOptions'

import type { ThemeFromAPI } from 'domain/entities/themes'

export function CellActionTheme({ theme }: { theme: ThemeFromAPI }) {
  const subThemes = displaySubThemes([theme])
  const content = [theme.name, `(${subThemes})`].join(' ')

  return content !== '' ? (
    <ThemesOrTagsContainer title={content}>
      {theme.name}
      {subThemes && <SubThemesOrSubTagsContainer> ({subThemes})</SubThemesOrSubTagsContainer>}
    </ThemesOrTagsContainer>
  ) : null
}
