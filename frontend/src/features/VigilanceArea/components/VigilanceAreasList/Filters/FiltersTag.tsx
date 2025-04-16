import { setFilteredRegulatoryTags } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { vigilanceAreaFiltersActions } from './slice'

import type { TagAPI } from 'domain/entities/tags'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const { createdBy, seaFronts } = useAppSelector(state => state.vigilanceAreaFilters)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)

  const onDeleteTag = (valueToDelete: string | any, filterKey: string, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? [] : updatedFilter
      })
    )
  }

  const deleteRegulatoryTag = (regulatoryTagToDelete: TagAPI) => {
    dispatch(setFilteredRegulatoryTags(filteredRegulatoryTags.filter(tag => tag.id !== regulatoryTagToDelete.id)))
  }

  const hasFilters = createdBy?.length > 0 || seaFronts?.length > 0 || filteredRegulatoryTags?.length > 0

  if (!hasFilters) {
    return null
  }

  return (
    <StyledContainer data-cy="vigilance-areas-filter-tags">
      {createdBy?.map(author => (
        <SingleTag key={author} onDelete={() => onDeleteTag(author, 'createdBy', createdBy)}>
          {author}
        </SingleTag>
      ))}
      {seaFronts?.map(seaFront => (
        <SingleTag key={seaFront} onDelete={() => onDeleteTag(seaFront, 'seaFronts', seaFronts)}>
          {String(`Façade ${seaFront}`)}
        </SingleTag>
      ))}
      {filteredRegulatoryTags?.map(tag => (
        <SingleTag key={tag.id} onDelete={() => deleteRegulatoryTag(tag)}>
          {tag.name}
        </SingleTag>
      ))}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 2px;
  flex-wrap: wrap;
`
