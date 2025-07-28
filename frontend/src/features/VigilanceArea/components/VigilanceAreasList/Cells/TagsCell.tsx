import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'
import { displaySubTags } from '@utils/getTagsAsOptions'

import type { TagFromAPI } from 'domain/entities/tags'

export function TagsCell({ tags }: { tags: TagFromAPI[] }) {
  if (!tags || tags.length === 0) {
    return <span>-</span>
  }

  const formattedTags = tags.map(tag => {
    const subTags = displaySubTags([tag])

    return {
      component: (
        <>
          {tag.name} {subTags && <SubThemesOrSubTagsContainer>({subTags})</SubThemesOrSubTagsContainer>}
        </>
      ),
      title: subTags ? `${tag.name} (${subTags})` : tag.name
    }
  })

  const cellTitle = formattedTags.map(tag => tag.title).join(' - ')

  return (
    <>
      {formattedTags.map(({ component, title }, index) => (
        <ThemesOrTagsContainer key={title} title={cellTitle}>
          {component}
          {index < formattedTags.length - 1 ? ' - ' : ''}
        </ThemesOrTagsContainer>
      ))}
    </>
  )
}
