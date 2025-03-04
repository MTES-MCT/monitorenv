import { setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { vigilanceAreaFiltersActions } from './slice'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const { createdBy, seaFronts } = useAppSelector(state => state.vigilanceAreaFilters)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const onDeleteTag = (valueToDelete: string | any, filterKey: string, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? [] : updatedFilter
      })
    )
  }

  const deleteRegulatoryTheme = (regulatoryThemeToDelete: string) => {
    dispatch(setFilteredRegulatoryThemes(filteredRegulatoryThemes.filter(theme => theme !== regulatoryThemeToDelete)))
  }

  const hasFilters = createdBy?.length > 0 || seaFronts?.length > 0 || filteredRegulatoryThemes?.length > 0

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
      {filteredRegulatoryThemes?.map(theme => (
        <SingleTag key={theme} onDelete={() => deleteRegulatoryTheme(theme)}>
          {theme}
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
