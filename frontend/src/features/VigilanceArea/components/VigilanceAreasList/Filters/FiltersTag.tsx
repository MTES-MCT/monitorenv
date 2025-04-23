import { setFilteredRegulatoryTags, setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { filterSubTags } from '@features/Tags/utils/getTagsAsOptions'
import { filterSubThemes } from '@features/Themes/utils/getThemesAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { vigilanceAreaFiltersActions } from './slice'

import type { TagAPI } from 'domain/entities/tags'
import type { ThemeAPI } from 'domain/entities/themes'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const { createdBy, seaFronts } = useAppSelector(state => state.vigilanceAreaFilters)
  const { filteredRegulatoryTags, filteredRegulatoryThemes } = useAppSelector(state => state.layerSearch)

  const onDeleteTag = (valueToDelete: string | any, filterKey: string, filter) => {
    const updatedFilter = filter.filter(unit => unit !== valueToDelete)
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? [] : updatedFilter
      })
    )
  }

  const onDeleteTagTag = (valueToDelete: TagAPI, tagFilter: TagAPI[]) => {
    const updatedFilter: TagAPI[] = tagFilter
      .map(tag => filterSubTags(tag, valueToDelete))
      .filter(tag => tag !== undefined)
      .filter(tag => tag.id !== valueToDelete.id)

    dispatch(setFilteredRegulatoryTags(updatedFilter))
  }

  const onDeleteThemeTag = (valueToDelete: ThemeAPI, themeFilter: ThemeAPI[]) => {
    const updatedFilter: ThemeAPI[] = themeFilter
      .map(theme => filterSubThemes(theme, valueToDelete))
      .filter(theme => theme !== undefined)
      .filter(theme => theme.id !== valueToDelete.id)

    dispatch(setFilteredRegulatoryThemes(updatedFilter))
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
          {theme.subThemes.map(subTheme => (
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
          {tag.subTags.map(subTag => (
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
