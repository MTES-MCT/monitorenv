import { ExpandedRowValueDetail } from '@components/Table/TableWithSelectableRows/style'
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
          {tag.subTags && (
            <ExpandedRowValueDetail as="div" title={tag.subTags}>
              ({tag.subTags})
            </ExpandedRowValueDetail>
          )}
        </div>
      ))}
    </>
  )
}

const TagText = styled.span`
  color: ${p => p.theme.color.charcoal};
  white-space: break-spaces;
`
