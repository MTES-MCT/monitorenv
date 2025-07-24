import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setFilteredRegulatoryTags, setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, SingleTag } from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import styled from 'styled-components'

import { vigilanceAreaFiltersActions } from './slice'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const { createdBy, seaFronts } = useAppSelector(state => state.vigilanceAreaFilters)
  const { filteredRegulatoryTags, filteredRegulatoryThemes } = useAppSelector(state => state.layerSearch)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const debouncedSearchLayers = useSearchLayers()

  const genericSearchParams = {
    ampTypes: filteredAmpTypes,
    extent: searchExtent,
    regulatoryTags: filteredRegulatoryTags,
    regulatoryThemes: filteredRegulatoryThemes,
    searchedText: globalSearchText,
    shouldSearchByExtent: shouldFilterSearchOnMapExtent,
    vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
    vigilanceAreaSpecificPeriodFilter
  }

  const onDeleteTag = (valueToDelete: string | any, filterKey: string, filter) => {
    const updatedFilter = filter.filter(unit => unit !== valueToDelete)
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? [] : updatedFilter
      })
    )
  }

  const onDeleteTagTag = (valueToDelete: TagOption, tagFilter: TagOption[]) => {
    const updatedFilter = deleteTagTag(tagFilter, valueToDelete)
    dispatch(setFilteredRegulatoryTags(updatedFilter))
    debouncedSearchLayers({
      ...genericSearchParams,
      regulatoryTags: updatedFilter
    })
  }

  const onDeleteThemeTag = (valueToDelete: ThemeOption, themeFilter: ThemeOption[]) => {
    const updatedFilter = deleteThemeTag(themeFilter, valueToDelete)

    dispatch(setFilteredRegulatoryThemes(updatedFilter))
    debouncedSearchLayers({
      ...genericSearchParams,
      regulatoryThemes: updatedFilter
    })
  }

  const hasFilters =
    createdBy?.length > 0 ||
    seaFronts?.length > 0 ||
    filteredRegulatoryTags?.length > 0 ||
    filteredRegulatoryThemes?.length > 0

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
        <>
          <SingleTag
            key={theme.id}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteThemeTag(theme, filteredRegulatoryThemes)}
            title={theme.name}
          >
            {`Thème ${theme.name}`}
          </SingleTag>
          {theme.subThemes?.map(subTheme => (
            <SingleTag
              key={subTheme.id}
              accent={Accent.SECONDARY}
              onDelete={() => onDeleteThemeTag(subTheme, filteredRegulatoryThemes)}
              title={subTheme.name}
            >
              {`Sous-thème ${subTheme.name}`}
            </SingleTag>
          ))}
        </>
      ))}
      {filteredRegulatoryTags?.map(tag => (
        <>
          <SingleTag
            key={tag.id}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTagTag(tag, filteredRegulatoryTags)}
            title={tag.name}
          >
            {`Tag ${tag.name}`}
          </SingleTag>
          {tag.subTags?.map(subTag => (
            <SingleTag
              key={subTag.id}
              accent={Accent.SECONDARY}
              onDelete={() => onDeleteTagTag(subTag, filteredRegulatoryTags)}
              title={subTag.name}
            >
              {`Sous-tag ${subTag.name}`}
            </SingleTag>
          ))}
        </>
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
