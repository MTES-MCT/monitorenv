import styled from 'styled-components'

import type { TagFromAPI } from 'domain/entities/tags'

export function TagsDetailsCell({ tags }: { tags?: TagFromAPI[] }) {
  if (!tags || tags.length === 0) {
    return <span>-</span>
  }

  const formattedTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    subTags: tag.subTags.map(subTag => subTag.name).join(', ')
  }))

  return (
    <>
      {formattedTags.map(tag => (
        <div key={tag.id}>
          <TagText title={tag.name}>{tag.name}</TagText>
          {tag.subTags && <SubTagsText title={tag.subTags}>({tag.subTags})</SubTagsText>}
        </div>
      ))}
    </>
  )
}

const TagText = styled.span`
  color: ${p => p.theme.color.charcoal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SubTagsText = styled.div`
  color: ${p => p.theme.color.slateGray};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
