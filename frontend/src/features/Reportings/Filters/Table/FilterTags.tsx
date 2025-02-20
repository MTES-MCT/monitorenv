import { SingleTag } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ReportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { reportingsFiltersActions, ReportingsFiltersEnum } from '../slice'

export function FilterTags() {
  const { subThemes, themes } = useGetControlPlans()
  const dispatch = useAppDispatch()
  const { hasFilters, seaFrontFilter, sourceFilter, sourceTypeFilter, subThemesFilter, targetTypeFilter, themeFilter } =
    useAppSelector(state => state.reportingFilters)

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? undefined : updatedFilter
      })
    )
  }

  const hasTagFilters = useMemo(() => {
    if (
      hasFilters &&
      ((seaFrontFilter && seaFrontFilter?.length > 0) ||
        (sourceFilter && sourceFilter?.length > 0) ||
        (sourceTypeFilter && sourceTypeFilter?.length > 0) ||
        (subThemesFilter && subThemesFilter?.length > 0) ||
        (targetTypeFilter && targetTypeFilter?.length > 0) ||
        (themeFilter && themeFilter?.length > 0))
    ) {
      return true
    }

    return false
  }, [hasFilters, seaFrontFilter, sourceFilter, sourceTypeFilter, subThemesFilter, targetTypeFilter, themeFilter])

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
        themeFilter.map(themeId => (
          <SingleTag
            key={themeId}
            onDelete={() => onDeleteTag(themeId, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
          >
            {String(`Thème ${themes[themeId]?.theme}`)}
          </SingleTag>
        ))}
      {subThemesFilter &&
        subThemesFilter?.length > 0 &&
        subThemesFilter.map(subThemeId => (
          <SingleTag
            key={subThemeId}
            onDelete={() => onDeleteTag(subThemeId, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
          >
            {String(`Sous-thème ${subThemes[subThemeId]?.subTheme}`)}
          </SingleTag>
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
