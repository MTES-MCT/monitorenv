import { SingleTag } from '@mtes-mct/monitor-ui'
import { filterSubTags } from '@utils/getTagsAsOptions'
import { filterSubThemes } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ReportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { reportingsFiltersActions, ReportingsFiltersEnum } from '../slice'

import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const { hasFilters, seaFrontFilter, sourceFilter, sourceTypeFilter, tagFilter, targetTypeFilter, themeFilter } =
    useAppSelector(state => state.reportingFilters)

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, filter) => {
    const updatedFilter = filter.filter(unit => unit !== valueToDelete)
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? undefined : updatedFilter
      })
    )
  }
  const onDeleteThemeTag = (valueToDelete: ThemeFromAPI, filter: ThemeFromAPI[]) => {
    const updatedFilter: ThemeFromAPI[] = filter
      .map(theme => filterSubThemes(theme, valueToDelete))
      .filter(theme => theme !== undefined)
      .filter(theme => theme.id !== valueToDelete.id)

    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.THEME_FILTER,
        value: updatedFilter
      })
    )
  }

  const onDeleteTagTag = (valueToDelete: TagFromAPI, filter: TagFromAPI[]) => {
    const updatedFilter: TagFromAPI[] = filter
      .map(tag => filterSubTags(tag, valueToDelete))
      .filter(theme => theme !== undefined)
      .filter(theme => theme.id !== valueToDelete.id)
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.TAG_FILTER,
        value: updatedFilter
      })
    )
  }

  const hasTagFilters = useMemo(
    () =>
      hasFilters &&
      ((seaFrontFilter && seaFrontFilter?.length > 0) ||
        (sourceFilter && sourceFilter?.length > 0) ||
        (sourceTypeFilter && sourceTypeFilter?.length > 0) ||
        (targetTypeFilter && targetTypeFilter?.length > 0) ||
        (tagFilter && tagFilter?.length > 0) ||
        (themeFilter && themeFilter?.length > 0)),
    [hasFilters, seaFrontFilter, sourceFilter, sourceTypeFilter, targetTypeFilter, themeFilter, tagFilter]
  )

  if (!hasTagFilters) {
    return null
  }

  return (
    <StyledContainer data-cy="reportings-filter-tags">
      {sourceTypeFilter &&
        sourceTypeFilter.length > 0 &&
        sourceTypeFilter.map(sourceType => (
          <SingleTag
            key={sourceType}
            onDelete={() => onDeleteTag(sourceType, ReportingsFiltersEnum.SOURCE_TYPE_FILTER, sourceTypeFilter)}
          >
            {String(`Type ${ReportingSourceLabels[sourceType]}`)}
          </SingleTag>
        ))}
      {sourceFilter &&
        sourceFilter.length > 0 &&
        sourceFilter.map(source => (
          <SingleTag
            key={`${source.id}-${source.label}`}
            onDelete={() => onDeleteTag(source, ReportingsFiltersEnum.SOURCE_FILTER, sourceFilter)}
          >
            {String(`Source ${source.label}`)}
          </SingleTag>
        ))}
      {targetTypeFilter &&
        targetTypeFilter.length > 0 &&
        targetTypeFilter.map(targetType => (
          <SingleTag
            key={targetType}
            onDelete={() => onDeleteTag(targetType, ReportingsFiltersEnum.TARGET_TYPE_FILTER, targetTypeFilter)}
          >
            {String(`Cible ${ReportingTargetTypeLabels[targetType]}`)}
          </SingleTag>
        ))}
      {themeFilter &&
        themeFilter.length > 0 &&
        themeFilter.map(theme => (
          <>
            <SingleTag key={theme.id} onDelete={() => onDeleteThemeTag(theme, themeFilter)}>
              {String(`Thème ${theme.name}`)}
            </SingleTag>
            {theme.subThemes.map(subTheme => (
              <SingleTag key={subTheme.id} onDelete={() => onDeleteThemeTag(subTheme, themeFilter)}>
                {String(`Sous-thème ${subTheme.name}`)}
              </SingleTag>
            ))}
          </>
        ))}
      {tagFilter &&
        tagFilter.length > 0 &&
        tagFilter.map(tag => (
          <>
            <SingleTag key={tag.id} onDelete={() => onDeleteTagTag(tag, tagFilter)}>
              {String(`Tag ${tag.name}`)}
            </SingleTag>
            {tag.subTags.map(subTag => (
              <SingleTag key={subTag.id} onDelete={() => onDeleteTagTag(subTag, tagFilter)}>
                {String(`Sous-tag ${subTag.name}`)}
              </SingleTag>
            ))}
          </>
        ))}
      {seaFrontFilter &&
        seaFrontFilter.length > 0 &&
        seaFrontFilter.map(seaFront => (
          <SingleTag
            key={seaFront}
            onDelete={() => onDeleteTag(seaFront, ReportingsFiltersEnum.SEA_FRONT_FILTER, seaFrontFilter)}
          >
            {String(`Façade ${seaFront}`)}
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
