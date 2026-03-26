import { ThemesOrTagsContainer } from '@components/Table/style'

import type { TagFromAPI } from 'domain/entities/tags'

export function TagsCell({ tags }: { tags: TagFromAPI[] }) {
  if (!tags || tags.length === 0) {
    return <span>-</span>
  }

  return (
    <>
      {tags.map((tag, index) => (
        <ThemesOrTagsContainer key={tag.name} title={tag.name}>
          {tag.name}
          {index < tags.length - 1 ? ' - ' : ''}
        </ThemesOrTagsContainer>
      ))}
    </>
  )
}
