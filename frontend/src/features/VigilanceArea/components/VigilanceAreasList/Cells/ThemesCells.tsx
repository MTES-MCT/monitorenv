import { ThemesOrTagsContainer } from '@components/Table/style'

import type { TagFromAPI } from 'domain/entities/tags'

export function ThemesCell({ themes }: { themes: TagFromAPI[] }) {
  if (!themes || themes.length === 0) {
    return <span>-</span>
  }
  const title = themes.map(theme => theme.name).join(', ')

  return (
    <>
      {themes.map((theme, index) => (
        <ThemesOrTagsContainer key={theme.name} title={title}>
          {theme.name}
          {index < themes.length - 1 ? ', ' : ''}
        </ThemesOrTagsContainer>
      ))}
    </>
  )
}
